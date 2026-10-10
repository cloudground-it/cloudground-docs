---
title: API
description: Where the panel's API answers, how to authenticate, which requests it takes and how it reports errors.
type: reference
prerequisites:
  - An account in the panel, or an API token
version: a7d92ba
last_verified: 2026-10-10
sidebar_position: 1
---

The panel is driven entirely by its HTTP API: the web interface is one of its clients, like `cgctl`.
The full list of routes, with the role each one needs, is generated from the code in the
`docs/api.md` file of the [product repository](https://github.com/cloudground-it/cloudground/blob/main/docs/api.md).

## Where it answers {#where}

| Address | What it serves |
| --- | --- |
| `https://<ip>:8443` | API and interface, always, with a self-signed certificate. |
| `https://<panel-domain>` | API and interface, once you have [given the panel a domain](/server/panel-domain). |
| `/run/cloudground/api.sock` | The Unix socket behind both addresses (owner `cloudground`, group `www-data`, mode `0660`). |
| `http://127.0.0.1:9080` | Only `POST /api/connector/purge` and `GET /healthz`, for the sites on the same server. |

On the server, as root, you can talk to the socket directly:

```bash prompt
curl --unix-socket /run/cloudground/api.sock http://localhost/api/system/status \
  -H "Authorization: Bearer $CLOUDGROUND_TOKEN"
```

## Authentication {#authentication}

There are two ways.

**API token.** Send `Authorization: Bearer cgt_…`. A request with a token is judged by the token
alone, even when it carries a cookie. A token that is unknown, expired, revoked, or whose account is
no longer an enabled administrator gets **401** `invalid or revoked API token`. Any other
`Authorization` header (a Bearer that does not start with `cgt_`, a proxy's Basic authentication) is
ignored. To create one see [API tokens and cgctl](/access/api-tokens-and-cgctl).

**Session.** `POST /api/login` with `{"email": "…", "password": "…"}` sets the session cookie
`__Host-cloudground_session` (`Secure`, `HttpOnly`, `SameSite=Strict`). A session lasts 24 hours at
most and ends after 2 hours unused. When the account has two-step verification, the first answer is
**401** with `"totp_required": true`: repeat the request with `"totp": "<code>"`.

Password sign-in has limits: 30 attempts a minute per network (an IPv4 address, an IPv6 /64) and 8 a
minute per network and email, past which the answer is **429**. From the fifth failure on the same
email, every attempt waits before it is evaluated, 1 to 60 seconds.

`GET /api/session` answers `{"user": …}` or `{"user": null}`, never 401.

## Request rules {#request-rules}

- Requests that change something use `Content-Type: application/json`. File uploads also take
  `application/octet-stream`. A `DELETE` without a body needs no type. Otherwise: **415**.
- When the request carries `Origin`, its host must be the request's; when it carries
  `Sec-Fetch-Site`, it must be `same-origin` or `none`. Otherwise: **403**. Clients outside the
  browser, such as `cgctl` and `curl`, send neither header.
- The body is 4 MiB at most. The exceptions: sign-in, setup, passwords and profile (8 KiB), a custom
  certificate (256 KiB), a file upload or a DB Studio edit batch (16 MiB), a DB Studio import chunk
  (8 MiB). Beyond: **413**.
- An unknown JSON field is an error: **400** `malformed request`.

## Roles {#roles}

Every route needs one of these levels: open, signed in, whole server, manage, administrator. A role
that is not allowed gets **403**; a site an operator cannot reach answers **404**. Some routes are
session-only and answer a token with **403**: your own account, users, tokens and the site shell. The
full table is in [roles and permissions](/reference/roles-and-permissions).

## Errors {#errors}

Every error has the body `{"error": "<message>"}`.

| Status | When |
| --- | --- |
| `400` | Invalid request: malformed body, value out of bounds, non-numeric ID. |
| `401` | No valid session or token. |
| `403` | Role not allowed, request from another origin, required 2FA not yet enrolled, session-only route. |
| `404` | The resource does not exist, or is out of your reach. |
| `409` | Conflict with the current state: a domain already in use, a task already finished. |
| `413` | Body too large. |
| `415` | Body type other than `application/json`. |
| `429` | Too many attempts. |
| `502` | The panel did not complete the operation on the server. |
| `503` | The panel is busy or the agent does not answer: try again. May carry `Retry-After`. |
| `504` | The operation on the server ran past its time limit. |

When the error comes from the agent, the message never carries the server's commands or paths.

## Tasks {#tasks}

Long operations (creating a site, a backup, a release) answer **202** with `{"task": {"id": …}}`.
Follow the task with `GET /api/tasks/<id>`: its `status` is `pending`, `running`, `succeeded` or
`failed` (a cancelled task is `failed` with the error `Canceled`). `POST /api/tasks/<id>/cancel`
cancels it, when the kind of task allows it.

## Events {#events}

`GET /api/events` is a Server-Sent Events stream, same origin only, with the events your role may
see: tasks, sites, releases, backups, alerts. A `ping` arrives every 25 seconds. Reconnecting with
`Last-Event-ID` resumes where you were; when that is not possible you get `resync` and read the state
again.

## Next step {#next}

For scripts, `cgctl` already makes these calls for you: see the [CLI reference](/cli).
