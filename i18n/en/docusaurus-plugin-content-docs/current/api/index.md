---
title: API
description: Where the panel's API listens, how to authenticate, what requests it accepts and how it reports errors.
type: reference
prerequisites:
  - A panel account, or an API token
version: v0.3.0
last_verified: unverified
sidebar_position: 1
---

Everything the panel does goes through its HTTP API. The web interface is one client, like
`cgctl`. The full list of routes, with each one's role, is generated from the code into
`docs/api.md` in the [product repository](https://github.com/cloudground-it/cloudground/blob/main/docs/api.md).

## Endpoints {#where}

| Address | What it serves |
| --- | --- |
| `https://<ip>:8443` | API and interface, always, with a self-signed certificate. |
| `https://<panel-domain>` | API and interface, once you've [given the panel a domain](/docs/server/panel-domain). |
| `/run/cloudground/api.sock` | The Unix socket behind both addresses (owner `cloudground`, group `www-data`, mode `0660`). |
| `http://127.0.0.1:9080` | Only `POST /api/connector/purge` and `GET /healthz`, for sites on the same server. |

On the server, as root, you can call the socket directly:

```bash prompt
curl --unix-socket /run/cloudground/api.sock http://localhost/api/system/status \
  -H "Authorization: Bearer $CLOUDGROUND_TOKEN"
```

## Authentication {#authentication}

**API token.** Send `Authorization: Bearer cgt_…`. A request with a token is authorized by the token
alone, even if it also carries a cookie. A token that is unknown, expired or revoked, or whose
account is no longer an enabled administrator, gets **401** `invalid or revoked API token`. Any other
`Authorization` header (a Bearer value that doesn't start with `cgt_`, a proxy's Basic auth) is
ignored. To create a token, see [API tokens and cgctl](/docs/access/api-tokens-and-cgctl).

**Session.** `POST /api/login` with `{"email": "…", "password": "…"}` sets the
`__Host-cloudground_session` cookie (`Secure`, `HttpOnly`, `SameSite=Strict`). A session lasts at
most 24 hours and expires after 2 hours of inactivity. If the account uses two-step verification, the
first response is **401** with `"totp_required": true`. Send the request again with
`"totp": "<code>"`.

Password sign-in is rate-limited: 30 attempts per minute per network (an IPv4 address or an IPv6
/64), and 8 per minute per network and email. Past those limits the response is **429**. From the
fifth failure on the same email, each attempt is delayed by 1 to 60 seconds before it's checked (see
[sign-in protection](/docs/explanation/sign-in-protection)).

*Since v0.2.0.* Delays longer than 30 seconds also run to completion, and the response is the result
of the check, **401** or **200**, never a server error. If the client closes the connection during
the delay, the attempt isn't checked and gets **429**.

`GET /api/session` returns `{"user": …}` or `{"user": null}`, never 401.

## Request rules {#request-rules}

- Requests that change something must use `Content-Type: application/json`. File uploads also accept
  `application/octet-stream`. A `DELETE` without a body needs no content type. Anything else gets
  **415**.
- If the request has an `Origin` header, its host must match the request's host. If it has
  `Sec-Fetch-Site`, the value must be `same-origin` or `none`. Otherwise the response is **403**.
  Non-browser clients such as `cgctl` and `curl` send neither header.
- Request bodies are capped at 4 MiB, with these exceptions: sign-in, setup, every route that takes a
  password, and the profile (8 KiB); a custom certificate (256 KiB); a file upload or a Quarry edit
  batch (16 MiB); a Quarry upload chunk (8 MiB). Anything larger gets **413**.
- Unknown JSON fields are an error: **400** `malformed request`.
- *Since v0.2.0.* Headers must arrive within 5 seconds. The body gets its own time budget: 30 seconds
  plus 1 second per 64 KiB of its size limit (or of its actual length, if smaller), so a 16 MiB upload
  gets 4 minutes 46 seconds. A stalled body is cut off. Once the body has been read, this budget no
  longer applies, so long-running requests such as a Quarry query or a backup repository test aren't
  cut off after 30 seconds.

## Roles {#roles}

Every route requires one of these levels: open, signed in, whole server, manage, administrator. A
role that isn't allowed gets **403**. A site an operator can't access returns **404**. Some routes
accept sessions only and answer **403** to a token: your own account, users, tokens, site shell and
routing, firewall rules and enabling the firewall (`POST /api/firewall/enable`, since v0.2.0),
changes to the block list (since v0.3.0), the panel's certificate and panel updates. The full table
is in [roles and permissions](/docs/reference/roles-and-permissions).

## Security {#security}

*Since v0.3.0.* Routes for blocking, scanning and hardening. The complete list is in `docs/api.md` in
the product repository.

| Route | Role | What it does |
| --- | --- | --- |
| `GET /api/blocklist` | whole server | The block list: `blocked`, `allowed`, `settings`, `enforced` (and `error`), `watching` (the SSH and WordPress readers) and `your_address`. |
| `POST /api/blocklist/blocks`, `DELETE /api/blocklist/blocks` | administrator, session | Blocks (`{"address", "note", "minutes"}`) or unblocks (`{"address"}`). |
| `POST /api/blocklist/allowed`, `DELETE /api/blocklist/allowed` | administrator, session | Adds or removes an always-allowed address. |
| `PUT /api/blocklist/settings` | administrator, session | Automatic blocking: `enabled`, `max_failures` (3–100) within `window_minutes` (1–1440), `ban_minutes` (1–43200). |
| `PUT /api/sites/<id>/blocking` | manage | The site's rules: `addresses`, `user_agents`, `countries`, `allow_countries_only`. |
| `GET /api/sites/<id>/vulnerabilities` | signed in | A WordPress site's latest check: `enabled`, `checked_at`, `error`, `components` and `findings` (`component`, `slug`, `version`, `title`, `severity`, `cve`, `fixed_in`, `unfixed`, `link`). |
| `POST /api/sites/<id>/vulnerabilities/check` | manage | Runs a check now. Returns **202** with the task. |
| `GET /api/sites/<id>/malware` | signed in | The site's scans: `enabled`, `next_scan`, the latest `scan` and `findings` (`id`, `path`, `signature`, `status`: `open`, `quarantined` or `gone`). |
| `POST /api/sites/<id>/malware/scan` | manage | Runs a scan now (requires `malware_scan` on). Returns **202** with the task. |
| `POST /api/sites/<id>/malware/findings/<finding>/quarantine` | manage | Moves the file to quarantine. |
| `PUT /api/sites/<id>/wp/two-factor` | manage | `{"mode": "off"}`, `"optional"` or `"required"`. |
| `PUT /api/sites/<id>/wp/hardening` | manage | `{"xmlrpc_off", "xmlrpc_allow", "file_edit_off", "hide_version", "block_readme", "login_path"}`. |

`vulnerability` and `malware` alerts show up in the alert list like any other alert.

## Functions {#functions}

*Since v0.9.0.* Functions belong to the server, not to a site. For the values, see
[functions: values and limits](/docs/reference/functions); the complete list is in `docs/api.md` in
the product repository.

| Route | Role | What it does |
| --- | --- | --- |
| `GET /api/functions` | whole server | The functions by name (`id`, `name`, `runtime`, `version`, `memory_mb`, `timeout_sec`, `schedule`, `env`, `secrets`, `auth`, `cors_origins`, `domains`, `release`, `urls`, `has_token`, `last`) and `domain`, the functions domain. |
| `POST /api/functions` | administrator | Creates a function: `name` and `runtime` are required; then `version`, `memory_mb`, `timeout_sec`, `schedule`, `auth`, `cors_origins`, `env`, `secrets`, `files` or `code`, `template` (`http` or `scheduled`). Returns **201**; with `auth` set to `token` it carries `token`. |
| `GET /api/functions/<name>` | whole server | The function with `entry`, `files` (the live code) and `releases`. |
| `PUT /api/functions/<name>` | administrator | Changes one or more fields. `files` or `code` make a new release; a secret set to `""` is removed, `••••••••` is kept. |
| `DELETE /api/functions/<name>` | administrator | Deletes the function (**204**). |
| `POST /api/functions/<name>/rollback` | administrator | Goes back to the previous release, or to the one in `{"release"}`. |
| `POST /api/functions/<name>/invoke` | administrator | The test: `{"method", "path", "body"}`; answers `{status, ms, body, error}`. |
| `GET /api/functions/<name>/logs` | whole server | `invocations` and `output`. |
| `POST /api/functions/<name>/token` | administrator | A new token; the old one stops working; access becomes `token`. |
| `PUT /api/functions/<name>/domains` | administrator | `{"domains": [...]}`: the own domains, up to 10. |
| `GET /api/functions/<name>/domains/status` | whole server | DNS and certificate of the own domains. |
| `GET /api/functions/domain/status`, `PUT /api/functions/domain` | whole server, administrator | The functions domain, with DNS and certificate, and how to change it (`{"domain"}`, empty to remove it). |

A name already in use gives **409**; a runtime the server doesn't have gives **412**; `domain` can't be
used as a name.

## Errors {#errors}

Every error has the body `{"error": "<message>"}`.

| Status | When |
| --- | --- |
| `400` | Invalid request: malformed body, value out of range, non-numeric ID. |
| `401` | No valid session or token. |
| `403` | Role not allowed, cross-origin request, required 2FA not set up yet, session-only route. |
| `404` | The resource doesn't exist, or you can't access it. |
| `409` | Conflicts with the current state: a domain already in use, a task already finished. |
| `413` | Body too large. |
| `415` | Body type other than `application/json`. |
| `429` | Too many attempts. |
| `502` | The panel couldn't complete the operation on the server. |
| `503` | The panel is busy or the agent isn't responding. Try again. May include `Retry-After`. |
| `504` | The operation on the server exceeded its time limit. |

Errors that come from the agent don't expose the server's commands or paths.

## Tasks {#tasks}

Long-running operations (creating a site, a backup, a release) return **202** with
`{"task": {"id": …}}`. Poll the task with `GET /api/tasks/<id>`. Its `status` is `pending`,
`running`, `succeeded` or `failed` (a cancelled task is `failed` with the error `Canceled`).
`POST /api/tasks/<id>/cancel` cancels it, if that kind of task can be cancelled.

*Since v0.2.0.* Alongside `kind` (its internal name, such as `backup.run`), each task has a `name`
field with a readable name in the reader's language. `GET /api/tasks/names` returns all of them, for
example `{"backup.run": "Backup", "backup.verify": "Restore test", …}`. Use it to name the tasks in
[events](#events), which only carry `kind`.

## Events {#events}

`GET /api/events` is a Server-Sent Events stream, same-origin only, carrying the events your role can
see: tasks, sites, releases, backups, alerts. A `ping` arrives every 25 seconds. Reconnect with
`Last-Event-ID` to resume where you left off. If that isn't possible, you get `resync` and should
reload the state.

## Next step {#next}

For scripting, `cgctl` already makes these calls: see the [CLI reference](/docs/cli).
