---
title: API
description: Dove risponde l'API del pannello, come ci si autentica, quali richieste accetta e come risponde agli errori.
type: reference
prerequisites:
  - Un account nel pannello, o un token API
version: v0.3.0
last_verified: unverified
sidebar_position: 1
---

Il pannello è guidato interamente dalla sua API HTTP: l'interfaccia web è uno dei suoi client, come
`cgctl`. L'elenco completo delle rotte, con il ruolo che ognuna richiede, è generato dal codice nel
file `docs/api.md` del [repository del prodotto](https://github.com/cloudground-it/cloudground/blob/main/docs/api.md).

## Dove risponde {#where}

| Indirizzo | Cosa serve |
| --- | --- |
| `https://<ip>:8443` | API e interfaccia, sempre, con un certificato autofirmato. |
| `https://<dominio-del-pannello>` | API e interfaccia, dopo che hai [dato un dominio al pannello](/docs/server/panel-domain). |
| `/run/cloudground/api.sock` | Il socket Unix dietro i due indirizzi (proprietario `cloudground`, gruppo `www-data`, permessi `0660`). |
| `http://127.0.0.1:9080` | Solo `POST /api/connector/purge` e `GET /healthz`, per i siti dello stesso server. |

Sul server, come root, puoi parlare direttamente con il socket:

```bash prompt
curl --unix-socket /run/cloudground/api.sock http://localhost/api/system/status \
  -H "Authorization: Bearer $CLOUDGROUND_TOKEN"
```

## Autenticazione {#authentication}

Ci sono due modi.

**Token API.** Manda `Authorization: Bearer cgt_…`. Una richiesta con un token viene giudicata solo
dal token, anche se porta un cookie. Un token sconosciuto, scaduto, revocato o di un account che
non è più un amministratore attivo riceve **401** `invalid or revoked API token`. Un altro header
`Authorization` (un Bearer che non inizia con `cgt_`, l'autenticazione Basic di un proxy) viene
ignorato. Per crearne uno vedi [token API e cgctl](/docs/access/api-tokens-and-cgctl).

**Sessione.** `POST /api/login` con `{"email": "…", "password": "…"}` imposta il cookie di sessione
`__Host-cloudground_session` (`Secure`, `HttpOnly`, `SameSite=Strict`). La sessione dura al massimo
24 ore e finisce dopo 2 ore senza uso. Se l'account ha la verifica in due passaggi, la prima risposta
è **401** con `"totp_required": true`: ripeti la richiesta con `"totp": "<codice>"`.

L'accesso con password ha dei limiti: 30 tentativi al minuto per rete (un indirizzo IPv4, una rete
IPv6 /64) e 8 al minuto per rete ed email, oltre i quali la risposta è **429**. Dal quinto errore
sulla stessa email ogni tentativo aspetta prima di essere valutato, da 1 a 60 secondi (vedi
[la protezione dell'accesso](/docs/explanation/sign-in-protection)).

*Da v0.2.0.* Anche un'attesa più lunga di 30 secondi arriva in fondo: la risposta è quella del
controllo, **401** o **200**, mai un errore del server. Se il client chiude la connessione mentre
aspetta, il tentativo non viene valutato e riceve **429**.

`GET /api/session` risponde `{"user": …}` o `{"user": null}`, mai 401.

## Regole delle richieste {#request-rules}

- Le richieste che modificano qualcosa usano `Content-Type: application/json`. I caricamenti di file
  accettano anche `application/octet-stream`. Un `DELETE` senza corpo non ha bisogno del tipo.
  Altrimenti: **415**.
- Se la richiesta porta `Origin`, il suo host deve essere quello della richiesta; se porta
  `Sec-Fetch-Site`, deve essere `same-origin` o `none`. Altrimenti: **403**. I client fuori dal
  browser, come `cgctl` e `curl`, non mandano questi header.
- Il corpo è al massimo 4 MiB. Fanno eccezione: accesso, setup, ogni rotta che riceve una password e
  il profilo (8 KiB), un
  certificato personalizzato (256 KiB), un caricamento di file o una modifica in blocco di Quarry
  (16 MiB), un pezzo di caricamento di Quarry (8 MiB). Oltre: **413**.
- Un campo JSON sconosciuto è un errore: **400** `malformed request`.
- *Da v0.2.0.* Le intestazioni devono arrivare entro 5 secondi. Il corpo ha un tempo suo: 30 secondi
  più 1 secondo per ogni 64 KiB del suo limite (o della sua lunghezza, se è minore), così un
  caricamento da 16 MiB ha 4 minuti e 46 secondi. Un corpo che si ferma viene interrotto. Una volta
  letto il corpo, questo tempo non vale più: una richiesta che lavora a lungo, come una lettura di
  Quarry o la prova del repository dei backup, non viene interrotta dopo 30 secondi.

## Ruoli {#roles}

Ogni rotta richiede uno di questi livelli: aperta, account collegato, tutto il server, gestione,
amministratore. Un ruolo non ammesso riceve **403**; un sito che un operatore non può raggiungere
risponde **404**. Alcune rotte sono solo per sessioni e rispondono **403** a un token: il proprio
account, gli utenti, i token, la shell e il routing dei siti, le regole del firewall e la sua
accensione (`POST /api/firewall/enable`, da v0.2.0), le modifiche alla lista dei blocchi (da v0.3.0), il certificato e l'aggiornamento del pannello. La tabella completa è in
[ruoli e permessi](/docs/reference/roles-and-permissions).

## Sicurezza {#security}

*Da v0.3.0.* Le rotte di blocco, controllo e protezione. L'elenco completo è nel file `docs/api.md` del
repository del prodotto.

| Rotta | Ruolo | Cosa fa |
| --- | --- | --- |
| `GET /api/blocklist` | tutto il server | La lista dei blocchi: `blocked`, `allowed`, `settings`, `enforced` (e `error`), `watching` (le letture di SSH e WordPress) e `your_address`. |
| `POST /api/blocklist/blocks`, `DELETE /api/blocklist/blocks` | amministratore, sessione | Blocca (`{"address", "note", "minutes"}`) o sblocca (`{"address"}`). |
| `POST /api/blocklist/allowed`, `DELETE /api/blocklist/allowed` | amministratore, sessione | Aggiunge o toglie un indirizzo dai sempre consentiti. |
| `PUT /api/blocklist/settings` | amministratore, sessione | Il blocco automatico: `enabled`, `max_failures` (3–100) in `window_minutes` (1–1440), `ban_minutes` (1–43200). |
| `PUT /api/sites/<id>/blocking` | gestione | Le regole del sito: `addresses`, `user_agents`, `countries`, `allow_countries_only`. |
| `GET /api/sites/<id>/vulnerabilities` | account collegato | L'ultimo controllo di un sito WordPress: `enabled`, `checked_at`, `error`, `components` e i `findings` (`component`, `slug`, `version`, `title`, `severity`, `cve`, `fixed_in`, `unfixed`, `link`). |
| `POST /api/sites/<id>/vulnerabilities/check` | gestione | Controlla ora; risponde **202** con l'attività. |
| `GET /api/sites/<id>/malware` | account collegato | Le scansioni del sito: `enabled`, `next_scan`, l'ultima `scan` e i `findings` (`id`, `path`, `signature`, `status`: `open`, `quarantined` o `gone`). |
| `POST /api/sites/<id>/malware/scan` | gestione | Scansiona ora (serve `malware_scan` acceso); **202** con l'attività. |
| `POST /api/sites/<id>/malware/findings/<finding>/quarantine` | gestione | Mette il file in quarantena. |
| `PUT /api/sites/<id>/wp/two-factor` | gestione | `{"mode": "off"}`, `"optional"` o `"required"`. |
| `PUT /api/sites/<id>/wp/hardening` | gestione | `{"xmlrpc_off", "xmlrpc_allow", "file_edit_off", "hide_version", "block_readme", "login_path"}`. |

Gli avvisi del tipo `vulnerability` e `malware` compaiono nell'elenco degli avvisi come gli altri.

## Funzioni {#functions}

*Da v0.9.0.* Le funzioni sono del server, non di un sito. Per i valori vedi
[funzioni: valori e limiti](/docs/reference/functions); l'elenco completo è nel file `docs/api.md` del
repository del prodotto.

| Rotta | Ruolo | Cosa fa |
| --- | --- | --- |
| `GET /api/functions` | tutto il server | Le funzioni per nome (`id`, `name`, `runtime`, `version`, `memory_mb`, `timeout_sec`, `schedule`, `env`, `secrets`, `auth`, `cors_origins`, `domains`, `release`, `urls`, `has_token`, `last`) e `domain`, il dominio delle funzioni. |
| `POST /api/functions` | amministratore | Crea una funzione: `name` e `runtime` obbligatori; poi `version`, `memory_mb`, `timeout_sec`, `schedule`, `auth`, `cors_origins`, `env`, `secrets`, `files` o `code`, `template` (`http` o `scheduled`). Risponde **201**; con `auth` `token` porta `token`. |
| `GET /api/functions/<nome>` | tutto il server | La funzione con `entry`, `files` (il codice attivo) e `releases`. |
| `PUT /api/functions/<nome>` | amministratore | Cambia uno o più campi. `files` o `code` fanno un rilascio nuovo; un segreto `""` si toglie, `••••••••` si tiene. |
| `DELETE /api/functions/<nome>` | amministratore | Elimina la funzione (**204**). |
| `POST /api/functions/<nome>/rollback` | amministratore | Torna al rilascio di prima, o a quello in `{"release"}`. |
| `POST /api/functions/<nome>/invoke` | amministratore | La prova: `{"method", "path", "body"}`; risponde `{status, ms, body, error}`. |
| `GET /api/functions/<nome>/logs` | tutto il server | `invocations` e `output`. |
| `POST /api/functions/<nome>/token` | amministratore | Un token nuovo, e il vecchio non vale più; l'accesso diventa `token`. |
| `PUT /api/functions/<nome>/domains` | amministratore | `{"domains": [...]}`: i domini propri, fino a 10. |
| `GET /api/functions/<nome>/domains/status` | tutto il server | DNS e certificato dei domini propri. |
| `GET /api/functions/domain/status`, `PUT /api/functions/domain` | tutto il server, amministratore | Il dominio delle funzioni, con DNS e certificato, e come cambiarlo (`{"domain"}`, vuoto per toglierlo). |

Un nome già usato dà **409**; un runtime non installato sul server dà **412**; `domain` non si può usare
come nome.

## Errori {#errors}

Ogni errore ha il corpo `{"error": "<messaggio>"}`.

| Stato | Quando |
| --- | --- |
| `400` | Richiesta non valida: corpo malformato, valore fuori dai limiti, ID non numerico. |
| `401` | Nessuna sessione o token valido. |
| `403` | Ruolo non ammesso, richiesta da un'altra origine, 2FA obbligatoria non ancora attivata, rotta solo per sessioni. |
| `404` | La risorsa non esiste, o non è alla tua portata. |
| `409` | Conflitto con lo stato attuale: un dominio già usato, un'attività già finita. |
| `413` | Corpo troppo grande. |
| `415` | Tipo del corpo diverso da `application/json`. |
| `429` | Troppi tentativi. |
| `502` | Il pannello non ha completato l'operazione sul server. |
| `503` | Il pannello è occupato o l'agente non risponde: riprova. Può portare `Retry-After`. |
| `504` | L'operazione sul server è andata oltre il tempo massimo. |

Quando l'errore viene dall'agente, il messaggio non riporta mai i comandi o i percorsi del server.

## Attività {#tasks}

Le operazioni lunghe (creare un sito, un backup, un rilascio) rispondono **202** con
`{"task": {"id": …}}`. Segui l'attività con `GET /api/tasks/<id>`: il campo `status` vale `pending`,
`running`, `succeeded` o `failed` (un'attività annullata è `failed` con l'errore `Canceled`).
`POST /api/tasks/<id>/cancel` la annulla, se il tipo di attività lo permette.

*Da v0.2.0.* Ogni attività ha, accanto a `kind` (il nome interno, come `backup.run`), il campo `name`:
il suo nome a parole nella lingua di chi legge. `GET /api/tasks/names` restituisce tutti i nomi, per
esempio `{"backup.run": "Backup", "backup.verify": "Ripristino di prova", …}`: serve a nominare le
attività degli [eventi](#events), che portano solo `kind`.

## Eventi {#events}

`GET /api/events` è un flusso Server-Sent Events, solo dalla stessa origine, con gli eventi che il
tuo ruolo può vedere: attività, siti, rilasci, backup, avvisi. Un `ping` arriva ogni 25 secondi.
Riconnettendoti con `Last-Event-ID` riprendi da dove eri; se non è possibile ricevi `resync` e
rileggi lo stato.

## Prossimo passo {#next}

Per gli script, `cgctl` fa già queste chiamate per te: vedi il [riferimento della CLI](/docs/cli).
