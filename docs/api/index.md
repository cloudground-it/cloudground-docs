---
title: API
description: Dove risponde l'API del pannello, come ci si autentica, quali richieste accetta e come risponde agli errori.
type: reference
prerequisites:
  - Un account nel pannello, o un token API
version: a7d92ba
last_verified: 2026-10-10
sidebar_position: 1
---

Il pannello è guidato interamente dalla sua API HTTP: l'interfaccia web è uno dei suoi client, come
`cgctl`. L'elenco completo delle rotte, con il ruolo che ognuna richiede, è generato dal codice nel
file `docs/api.md` del [repository del prodotto](https://github.com/cloudground-it/cloudground/blob/main/docs/api.md).

## Dove risponde {#where}

| Indirizzo | Cosa serve |
| --- | --- |
| `https://<ip>:8443` | API e interfaccia, sempre, con un certificato autofirmato. |
| `https://<dominio-del-pannello>` | API e interfaccia, dopo che hai [dato un dominio al pannello](/server/panel-domain). |
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
ignorato. Per crearne uno vedi [token API e cgctl](/access/api-tokens-and-cgctl).

**Sessione.** `POST /api/login` con `{"email": "…", "password": "…"}` imposta il cookie di sessione
`__Host-cloudground_session` (`Secure`, `HttpOnly`, `SameSite=Strict`). La sessione dura al massimo
24 ore e finisce dopo 2 ore senza uso. Se l'account ha la verifica in due passaggi, la prima risposta
è **401** con `"totp_required": true`: ripeti la richiesta con `"totp": "<codice>"`.

L'accesso con password ha dei limiti: 30 tentativi al minuto per rete (un indirizzo IPv4, una rete
IPv6 /64) e 8 al minuto per rete ed email, oltre i quali la risposta è **429**. Dal quinto errore
sulla stessa email ogni tentativo aspetta prima di essere valutato, da 1 a 60 secondi.

`GET /api/session` risponde `{"user": …}` o `{"user": null}`, mai 401.

## Regole delle richieste {#request-rules}

- Le richieste che modificano qualcosa usano `Content-Type: application/json`. I caricamenti di file
  accettano anche `application/octet-stream`. Un `DELETE` senza corpo non ha bisogno del tipo.
  Altrimenti: **415**.
- Se la richiesta porta `Origin`, il suo host deve essere quello della richiesta; se porta
  `Sec-Fetch-Site`, deve essere `same-origin` o `none`. Altrimenti: **403**. I client fuori dal
  browser, come `cgctl` e `curl`, non mandano questi header.
- Il corpo è al massimo 4 MiB. Fanno eccezione: accesso, setup, password e profilo (8 KiB), un
  certificato personalizzato (256 KiB), un caricamento di file o una modifica in blocco di DB Studio
  (16 MiB), un pezzo di importazione di DB Studio (8 MiB). Oltre: **413**.
- Un campo JSON sconosciuto è un errore: **400** `malformed request`.

## Ruoli {#roles}

Ogni rotta richiede uno di questi livelli: aperta, account collegato, tutto il server, gestione,
amministratore. Un ruolo non ammesso riceve **403**; un sito che un operatore non può raggiungere
risponde **404**. Alcune rotte sono solo per sessioni e rispondono **403** a un token: il proprio
account, gli utenti, i token e la shell dei siti. La tabella completa è in
[ruoli e permessi](/reference/roles-and-permissions).

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

## Eventi {#events}

`GET /api/events` è un flusso Server-Sent Events, solo dalla stessa origine, con gli eventi che il
tuo ruolo può vedere: attività, siti, rilasci, backup, avvisi. Un `ping` arriva ogni 25 secondi.
Riconnettendoti con `Last-Event-ID` riprendi da dove eri; se non è possibile ricevi `resync` e
rileggi lo stato.

## Prossimo passo {#next}

Per gli script, `cgctl` fa già queste chiamate per te: vedi il [riferimento della CLI](/cli).
