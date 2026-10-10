---
title: cgctl
description: Every cgctl command, its options, the configuration variables and the exit codes.
type: reference
prerequisites:
  - An API token, or an account's email and password
version: a7d92ba
last_verified: 2026-10-10
sidebar_position: 1
---

`cgctl` is a thin client of the panel's API, made for scripts. Every command becomes a single API
request; the API's JSON answer goes, indented, to standard output. To get started see
[API tokens and cgctl](/access/api-tokens-and-cgctl).

## Syntax {#syntax}

```text
cgctl [--wait|-w] [--timeout <duration>] <command> [arguments]
```

| Option | Effect |
| --- | --- |
| `--wait`, `-w` | When the answer names a task, follows it to the end (see [below](#wait)). |
| `--timeout <duration>` | How long to wait with `--wait`, as `30m`, `2h`. Default `1h`. |
| `--` | End of the options: what follows is the command. |
| `-v`, `--version`, `version` | Prints `cgctl <version>` and exits with 0, without reading the configuration. |
| `-h`, `--help`, `help` | Prints the usage and exits with 2. Also with no command. |

Options may stand anywhere on the line. Arguments that are IDs must be positive integers.

## Commands {#commands}

### Sites {#sites}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl sites list` | `GET /api/sites` | Lists the sites. |
| `cgctl sites create <domain> <type> [flags-json]` | `POST /api/sites` | Creates a site. `<type>` is `wordpress`, `woocommerce`, `static`, `php`, `laravel` or `proxy`. `flags-json` is a JSON object with the other creation fields; `domain` and `type` come from the arguments. |
| `cgctl sites delete <site-id>` | `DELETE /api/sites/<id>` | Deletes a site. |
| `cgctl cert issue <site-id>` | `POST /api/sites/<id>/certificate` | Requests the site's certificate. |
| `cgctl purge <site-id> [url ...]` | `POST /api/sites/<id>/purge` | Purges the page cache: only the given URLs, or the whole site without URLs. |
| `cgctl warm <site-id>` | `POST /api/sites/<id>/warm` | Warms the site's cache. |

For example, a WordPress site:

```bash
cgctl --wait sites create example.com wordpress \
  '{"admin_email": "you@example.com", "admin_user": "admin", "admin_password": "<at least 12 characters>"}'
```

### Staging and releases {#staging-and-releases}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl staging create <site-id>` | `POST /api/sites/<id>/staging` | Creates the staging copy. |
| `cgctl safe-push <site-id> [path ...]` | `POST /api/sites/<id>/safe-push` | Brings staging to production with Safe Push. The `path` arguments are the URL paths Performance Guard measures (for example `/` and `/shop/`). |
| `cgctl deploy <site-id> <folder>` | `POST /api/sites/<id>/deployments` | Publishes a release from a folder inside the site (`source_dir`). |
| `cgctl rollback <site-id>` | `POST /api/sites/<id>/rollback` | Goes back to the previous release. |

### Backups and database {#backups-and-database}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl backup run <site-id>` | `POST /api/sites/<id>/backups` | Takes a backup now. |
| `cgctl backup verify <backup-id>` | `POST /api/backups/<id>/verify` | Runs a restore test of the backup. |
| `cgctl backup restore <backup-id> <domain> [full\|files\|database]` | `POST /api/backups/<id>/restore` | Restores the backup. `<domain>` is the confirmation and must be the site's domain; the default mode is `full`. |
| `cgctl database import <site-id> <domain> <file.sql>` | `POST /api/sites/<id>/database/import` | Imports a SQL file. The path is relative to the site's folder; `<domain>` is the confirmation. |
| `cgctl cron run <cron-id>` | `POST /api/cron/<id>/run` | Runs a scheduled task now. |

### Server {#server}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl status` | `GET /api/system/status` | The server's status: CPU, memory, disk, main services. |
| `cgctl drift` | `GET /api/system/drift` | Managed files changed outside the panel. |
| `cgctl tasks` | `GET /api/tasks` | The latest 100 tasks. |
| `cgctl task <task-id>` | `GET /api/tasks/<id>` | One task. |
| `cgctl audit` | `GET /api/audit` | The latest 200 rows of the audit log. |
| `cgctl settings get` | `GET /api/settings` | The panel's settings. |
| `cgctl settings set <key> <value>` | `PUT /api/settings` | Changes one setting. |

### API tokens {#tokens}

These commands always sign in with email and password (`CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`
and, with 2FA, `CLOUDGROUND_TOTP`): the API does not take a token to manage tokens.

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl tokens list` | `GET /api/tokens` | Lists the tokens. |
| `cgctl tokens create <name> [days]` | `POST /api/tokens` | Creates a token; `days` from 0 (never) to 365. The token is shown once. |
| `cgctl tokens revoke <token-id>` | `DELETE /api/tokens/<id>` | Revokes a token. |

:::warning[They do not work on the local socket]

With the default `CLOUDGROUND_URL` (`unix:///run/cloudground/api.sock`) a sign-in with email and
password, and so these three commands, answers
`HTTP 401: authentication required`: the session cookie is `Secure` and cgctl does not send it back
over `unix://`. On the server run them with `CLOUDGROUND_URL=https://127.0.0.1:8443`, or create
tokens in the panel, under **Security**.

:::

### On the server {#on-the-server}

These commands run as root on the server and do not talk to the panel.

| Command | What it does |
| --- | --- |
| `cgctl install [--plan] [--from <dir> \| --release <dir>] [--skip-packages] [--container]` | Installs CloudGround or upgrades it in place; `--plan` shows what would change without changing anything. It is the command `install.sh` runs. |
| `cgctl doctor [--skip-packages] [--container]` | Checks every installation step and reports what does not match; exits with 1 when it finds differences, otherwise prints `no drift`. |
| `cgctl release verify <dir> [file ...]` | Checks a downloaded release against the signing keys built into cgctl; needs neither the panel nor a token. |

## Authentication {#authentication}

1. With a token (`CLOUDGROUND_TOKEN` or `CLOUDGROUND_TOKEN_FILE`), every request carries
   `Authorization: Bearer <token>`.
2. Without a token, `CLOUDGROUND_EMAIL` and `CLOUDGROUND_PASSWORD` (and `CLOUDGROUND_TOTP`) sign in
   once for the command. Only over `https://`: on the `unix://` socket every command answers
   `HTTP 401` (see [API tokens](#tokens)).
3. With neither, cgctl exits with 1 and explains how to get a token.

## Configuration {#configuration}

cgctl reads, from weakest to strongest: the defaults, the file `/etc/cloudground/cgctl.env` (or the
file in `CLOUDGROUND_CONFIG`), the environment. The file has one `KEY=value` line per variable; blank
lines and lines starting with `#` or `;` are ignored. A file the user cannot read is ignored.

| Variable | Default | Value |
| --- | --- | --- |
| `CLOUDGROUND_URL` | `unix:///run/cloudground/api.sock` | `unix://<absolute path>`, `https://host[:port]`, or `http://` to a local address only. |
| `CLOUDGROUND_TOKEN` | — | A token: `cgt_` followed by 43 base64url characters. |
| `CLOUDGROUND_TOKEN_FILE` | — | A file that holds the token. |
| `CLOUDGROUND_INSECURE` | off | `1` skips certificate verification to a non-local address. |
| `CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`, `CLOUDGROUND_TOTP` | — | Password sign-in, without a token. |
| `CLOUDGROUND_CONFIG` | — | Another file instead of `/etc/cloudground/cgctl.env`. |

Token and token file are one setting: the environment beats the file, and within one source the
token beats the token file. Switches take `1` (on) or empty and `0` (off); other values are an error.
Every configuration error names the variable and where it came from.

With `https://` cgctl verifies the certificate, except to a local address or with
`CLOUDGROUND_INSECURE=1`. cgctl uses no proxy.

## Output and errors {#output}

The API's answer goes to standard output, as indented JSON. Errors go to standard error as
`cgctl: HTTP <status>: <the API's error>`.

## Waiting for a task {#wait}

With `--wait`, when the answer names a task, cgctl asks `GET /api/tasks/<id>` every second and prints
a progress line to standard error at every change. It stops when the status is final: `succeeded` is
success; `failed`, `cancelled` or any status other than `pending`, `queued` and `running` is failure.
The final task goes to standard output.

When the panel does not answer while cgctl waits (for example because it is restarting), cgctl tries
again; the answers 401, 403 and 404 end the wait as a failure. Without a task in the answer, `--wait`
changes nothing.

## Exit codes {#exit-codes}

| Code | Meaning |
| --- | --- |
| `0` | The request succeeded and, with `--wait`, so did the task. |
| `1` | The API refused the request, could not be reached, or the task failed. |
| `2` | Usage or configuration error. |
| `3` | With `--wait`, `--timeout` ran out with the task still running. |

## Next step {#next}

For what cgctl does not cover, use the [API](/api) directly.
