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
iniziare vedi [token API e cgctl](/access/api-tokens-and-cgctl).

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
| `cgctl sites create <dominio> <tipo> [flags-json]` | `POST /api/sites` | Crea un sito. `<tipo>` è `wordpress`, `woocommerce`, `static`, `php`, `laravel` o `proxy`. `flags-json` è un oggetto JSON con gli altri campi della creazione; `domain` e `type` vengono dagli argomenti. |
| `cgctl sites delete <id-sito>` | `DELETE /api/sites/<id>` | Elimina un sito. |
| `cgctl cert issue <id-sito>` | `POST /api/sites/<id>/certificate` | Chiede il certificato del sito. |
| `cgctl purge <id-sito> [url ...]` | `POST /api/sites/<id>/purge` | Svuota la cache di pagina: solo gli URL dati, o tutto il sito senza URL. |
| `cgctl warm <id-sito>` | `POST /api/sites/<id>/warm` | Riscalda la cache del sito. |

Per esempio, un sito WordPress:

```bash
cgctl --wait sites create example.com wordpress \
  '{"admin_email": "tu@example.com", "admin_user": "admin", "admin_password": "<almeno 12 caratteri>"}'
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
| `cgctl database import <id-sito> <dominio> <file.sql>` | `POST /api/sites/<id>/database/import` | Importa un file SQL. Il percorso è relativo alla cartella del sito; `<dominio>` è la conferma. |
| `cgctl cron run <id-cron>` | `POST /api/cron/<id>/run` | Esegue subito un'attività pianificata. |

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

## Autenticazione {#authentication}

1. Con un token (`CLOUDGROUND_TOKEN` o `CLOUDGROUND_TOKEN_FILE`), ogni richiesta porta
   `Authorization: Bearer <token>`.
2. Senza token, `CLOUDGROUND_EMAIL` e `CLOUDGROUND_PASSWORD` (e `CLOUDGROUND_TOTP`) accedono una volta
   per il comando.
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

La risposta dell'API esce su standard output, in JSON indentato. Gli errori escono su standard error
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

Per le operazioni che cgctl non copre, usa direttamente l'[API](/api).
