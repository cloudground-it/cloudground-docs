---
title: cgctl
description: Ogni comando di cgctl, le opzioni, le variabili di configurazione e i codici di uscita.
type: reference
prerequisites:
  - Un token API, o email e password di un account
version: unreleased
last_verified: unverified
sidebar_position: 1
---

`cgctl` è un client leggero dell'API del pannello, pensato per gli script. Ogni comando diventa una
sola richiesta all'API; la risposta JSON dell'API esce, indentata, sullo standard output. Per
iniziare vedi [token API e cgctl](/docs/access/api-tokens-and-cgctl).

## Sintassi {#syntax}

```text
cgctl [--wait|-w] [--timeout <durata>] <comando> [argomenti]
```

| Opzione | Effetto |
| --- | --- |
| `--wait`, `-w` | Se la risposta nomina un'attività, la segue fino alla fine (vedi [sotto](#wait)). |
| `--timeout <durata>` | Quanto aspettare con `--wait`, in formato `30m`, `2h`. Predefinito `1h`. |
| `--` | Fine delle opzioni: quello che segue è il comando. |
| `-v`, `--version`, `version` | Stampa `cgctl <versione>` ed esce con 0, senza leggere la configurazione. |
| `-h`, `--help`, `help` | Stampa l'uso ed esce con 2. Anche senza comando. |

Le opzioni possono stare in qualsiasi punto della riga. Gli argomenti che sono ID devono essere
interi positivi.

## Comandi {#commands}

### Siti {#sites}

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl sites list` | `GET /api/sites` | Elenca i siti. |
| `cgctl sites create <dominio> <tipo> [flags-json] [opzioni del database] [--json]` | `POST /api/sites` | Crea un sito e ne stampa il riepilogo (vedi [sotto](#sites-create)). `<tipo>` è `wordpress`, `woocommerce`, `static`, `php`, `laravel` o `proxy`. `flags-json` è un oggetto JSON con gli altri campi della creazione; `domain` e `type` vengono dagli argomenti. |
| `cgctl sites delete <id-sito>` | `DELETE /api/sites/<id>` | Elimina un sito. |
| `cgctl cert issue <id-sito>` | `POST /api/sites/<id>/certificate` | Chiede il certificato del sito. |
| `cgctl purge <id-sito> [url ...]` | `POST /api/sites/<id>/purge` | Svuota la cache di pagina: solo gli URL dati, o tutto il sito senza URL. |
| `cgctl warm <id-sito>` | `POST /api/sites/<id>/warm` | Riscalda la cache del sito. |

Per esempio, un sito WordPress:

```bash
cgctl --wait sites create example.com wordpress \
  '{"admin_email": "tu@example.com", "admin_user": "admin", "admin_password": "<almeno 12 caratteri>"}'
```

#### Creare un sito {#sites-create}

| Opzione | Effetto |
| --- | --- |
| `--with-database` | Crea anche un database per un sito `php` o `static` (`create_database: true`). WordPress, WooCommerce e Laravel ne hanno sempre uno; un `proxy` mai. |
| `--db-name <nome>` | Il nome del database principale. Senza, `site_<id>`. |
| `--db-user <nome>` | Il nome del suo utente. Senza, `site_<id>`. |
| `--db-password-stdin` | Legge la password del database da una riga dello standard input (al massimo 4 KiB; vuota è un errore). |
| `--db-password-file <file>` | Legge la password da un file, senza l'a capo finale. |
| `--db-password <password>` | La password sulla riga di comando. Funziona, ma stampa sullo standard error `cgctl: warning: --db-password puts the password where ps and the shell history show it; use --db-password-stdin or --db-password-file`. |
| `--json` | Stampa la risposta JSON dell'API invece del riepilogo. |

Senza password, il pannello ne genera una. Le opzioni accettano anche la forma `--opzione=valore` e
vincono sugli stessi campi di `flags-json`. Un'opzione sconosciuta, un'opzione senza valore, due
opzioni della password insieme, un file illeggibile o più di tre argomenti posizionali sono un errore
d'uso (uscita 2). I nomi e la password seguono le [regole dei database](/docs/reference/database-names-and-passwords).

Il riepilogo, in testo semplice: il sito e il suo stato (`Being created: task <id>`, o con `--wait`
`Created.`), poi URL e link del pannello, URL e utente di amministrazione di WordPress, host, porta,
socket, nome, utente e password del database, e SFTP (spento su un sito nuovo). Finisce ricordando che
la password si vede solo ora: la risposta dell'API è l'unico posto in cui compare.

```bash
cgctl --wait sites create shop.example.com laravel \
  --db-name shop --db-user shop_app --db-password-file /root/shop-db.pass
```

### Staging e rilasci {#staging-and-releases}

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl staging create <id-sito>` | `POST /api/sites/<id>/staging` | Crea la copia di staging. |
| `cgctl safe-push <id-sito> [percorso ...]` | `POST /api/sites/<id>/safe-push` | Porta lo staging in produzione con Safe Push. I `percorso` sono i percorsi URL che Performance Guard misura (per esempio `/` e `/shop/`). |
| `cgctl deploy <id-sito> <cartella>` | `POST /api/sites/<id>/deployments` | Pubblica un rilascio da una cartella dentro il sito (`source_dir`). |
| `cgctl rollback <id-sito>` | `POST /api/sites/<id>/rollback` | Torna al rilascio precedente. |

### Backup e database {#backups-and-database}

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl backup run <id-sito>` | `POST /api/sites/<id>/backups` | Fa un backup ora. |
| `cgctl backup verify <id-backup>` | `POST /api/backups/<id>/verify` | Esegue un ripristino di prova del backup. |
| `cgctl backup restore <id-backup> <dominio> [full\|files\|database]` | `POST /api/backups/<id>/restore` | Ripristina il backup. `<dominio>` è la conferma e deve essere il dominio del sito; la modalità predefinita è `full`. |
| `cgctl database list <id-sito>` | `GET /api/sites/<id>/databases` | I database del sito, con dimensioni e tabelle, e gli utenti database con i loro privilegi. |
| `cgctl database create <id-sito> <nome>` | `POST /api/sites/<id>/databases` | Crea un database del sito. |
| `cgctl database user-create <id-sito> <nome> [database:all\|read ...]` | `POST /api/sites/<id>/database-users` | Crea un utente database con i privilegi dati; la password generata compare una sola volta. |
| `cgctl database import <id-sito> <dominio> <file.sql> [database]` | `POST /api/sites/<id>/database/import` | Importa un file SQL, nel database principale o in quello indicato. Il percorso è relativo alla cartella del sito; `<dominio>` è la conferma. Prima viene salvato un punto di ripristino. |
| `cgctl cron run <id-cron>` | `POST /api/cron/<id>/run` | Esegue subito un'attività pianificata. |

### SFTP {#sftp}

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl sftp keys <id-sito>` | `GET /api/sites/<id>/ssh-keys` | Le chiavi SSH del sito e la porta SSH. |
| `cgctl sftp keys-only <id-sito> [file-chiave-pubblica]` | `POST /api/sites/<id>/sftp` | Attiva l'accesso SFTP con solo chiavi SSH (o ci passa). Con un file (`-` è lo standard input), prima aggiunge quella chiave. |
| `cgctl sftp password <id-sito>` | `POST /api/sites/<id>/sftp` | Attiva l'accesso SFTP con una password, letta come una riga dallo standard input (mai dagli argomenti). |
| `cgctl sftp off <id-sito>` | `POST /api/sites/<id>/sftp` | Disattiva l'accesso SFTP. |

### Server {#server}

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl status` | `GET /api/system/status` | Stato del server: CPU, memoria, disco, servizi principali. |
| `cgctl drift` | `GET /api/system/drift` | File gestiti modificati fuori dal pannello. |
| `cgctl tasks` | `GET /api/tasks` | Le ultime 100 attività. |
| `cgctl task <id-attività>` | `GET /api/tasks/<id>` | Un'attività. |
| `cgctl audit` | `GET /api/audit` | Le ultime 200 righe del registro attività. |
| `cgctl settings get` | `GET /api/settings` | Le impostazioni del pannello. |
| `cgctl settings set <chiave> <valore>` | `PUT /api/settings` | Cambia un'impostazione. |

### Token API {#tokens}

Questi comandi accedono sempre con email e password (`CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD` e,
con la 2FA, `CLOUDGROUND_TOTP`): l'API non accetta un token per gestire i token.

| Comando | Richiesta | Cosa fa |
| --- | --- | --- |
| `cgctl tokens list` | `GET /api/tokens` | Elenca i token. |
| `cgctl tokens create <nome> [giorni]` | `POST /api/tokens` | Crea un token; `giorni` da 0 (mai) a 365. Il token compare una sola volta. |
| `cgctl tokens revoke <id-token>` | `DELETE /api/tokens/<id>` | Revoca un token. |

### Sul server {#on-the-server}

Questi comandi girano da root sul server e non parlano con il pannello.

| Comando | Cosa fa |
| --- | --- |
| `cgctl install [--plan] [--from <cartella> \| --release <cartella>] [--skip-packages] [--container]` | Installa CloudGround, o ripara un server con la stessa release (un'altra release va installata con `cgctl update`); `--plan` mostra cosa cambierebbe senza cambiare niente. È il comando che lancia `install.sh`. |
| `cgctl doctor [--skip-packages] [--container]` | Controlla ogni passo dell'installazione e dice cosa non corrisponde; esce con 1 se trova differenze, altrimenti stampa `no drift`. |
| `cgctl update [--to <vX.Y.Z>] [--channel stable\|beta] [--check] [--timeout <durata>]` | Aggiorna CloudGround a una release firmata più recente, con snapshot e rollback automatico, come **Aggiorna ora** nel pannello; `--check` dice solo cosa installerebbe. Vedi [aggiorna CloudGround](/docs/server/update-cloudground). |
| `cgctl uninstall [--plan] [--yes] [--remove-sites [--confirm <hostname>]] [--purge-packages]` | Toglie CloudGround dal server, tenendo i siti e i loro database se non c'è `--remove-sites`; `--plan` elenca ogni azione senza cambiare nulla. Vedi [disinstalla CloudGround](/docs/server/uninstall-cloudground). |
| `cgctl release verify <cartella> [file ...]` | Verifica una release scaricata con le chiavi di firma compilate in cgctl; non serve il pannello né un token. |

## Autenticazione {#authentication}

1. Con un token (`CLOUDGROUND_TOKEN` o `CLOUDGROUND_TOKEN_FILE`), ogni richiesta porta
   `Authorization: Bearer <token>`.
2. Senza token, `CLOUDGROUND_EMAIL` e `CLOUDGROUND_PASSWORD` (e `CLOUDGROUND_TOTP`) accedono una volta
   per il comando, anche sul socket `unix://`.
3. Senza né l'uno né gli altri, cgctl esce con 1 e spiega come ottenere un token.

## Configurazione {#configuration}

cgctl legge, dal meno al più forte: i valori predefiniti, il file `/etc/cloudground/cgctl.env` (o il
file in `CLOUDGROUND_CONFIG`), l'ambiente. Il file ha una riga `CHIAVE=valore` per variabile; le
righe vuote e quelle che iniziano con `#` o `;` sono ignorate. Un file che l'utente non può leggere
viene ignorato.

| Variabile | Predefinito | Valore |
| --- | --- | --- |
| `CLOUDGROUND_URL` | `unix:///run/cloudground/api.sock` | `unix://<percorso assoluto>`, `https://host[:porta]`, o `http://` solo verso un indirizzo locale. |
| `CLOUDGROUND_TOKEN` | — | Un token `cgt_` seguito da 43 caratteri base64url. |
| `CLOUDGROUND_TOKEN_FILE` | — | Un file che contiene il token. |
| `CLOUDGROUND_INSECURE` | spento | `1` salta la verifica del certificato verso un indirizzo non locale. |
| `CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`, `CLOUDGROUND_TOTP` | — | Accesso con password, senza token. |
| `CLOUDGROUND_CONFIG` | — | Un altro file al posto di `/etc/cloudground/cgctl.env`. |

Token e file del token sono una sola impostazione: l'ambiente vince sul file, e dentro la stessa
fonte il token vince sul file del token. Gli interruttori accettano `1` (acceso) o vuoto e `0`
(spento); altri valori sono un errore. Ogni errore di configurazione nomina la variabile e da dove
viene.

Con `https://` cgctl verifica il certificato, tranne verso un indirizzo locale o con
`CLOUDGROUND_INSECURE=1`. cgctl non usa proxy.

## Output ed errori {#output}

La risposta dell'API esce su standard output, in JSON indentato; `sites create` stampa invece il suo
[riepilogo](#sites-create). Gli errori escono su standard error
come `cgctl: HTTP <stato>: <errore dell'API>`.

## Aspettare un'attività {#wait}

Con `--wait`, se la risposta nomina un'attività, cgctl chiede `GET /api/tasks/<id>` ogni secondo e
stampa su standard error una riga di avanzamento a ogni cambiamento. Si ferma quando lo stato è
finale: `succeeded` è un successo; `failed`, `cancelled` o qualsiasi stato diverso da `pending`,
`queued` e `running` è un fallimento. L'attività finale esce su standard output.

Se il pannello non risponde mentre cgctl aspetta (per esempio perché si sta riavviando), cgctl
riprova; le risposte 401, 403 e 404 terminano l'attesa con un fallimento. Senza un'attività nella
risposta, `--wait` non cambia nulla.

## Codici di uscita {#exit-codes}

| Codice | Significato |
| --- | --- |
| `0` | La richiesta è riuscita e, con `--wait`, anche l'attività. |
| `1` | L'API ha rifiutato la richiesta, non era raggiungibile, o l'attività è fallita. |
| `2` | Errore d'uso o di configurazione. |
| `3` | Con `--wait`, il `--timeout` è scaduto con l'attività ancora in corso. |

## Prossimo passo {#next}

Per le operazioni che cgctl non copre, usa direttamente l'[API](/docs/api).
