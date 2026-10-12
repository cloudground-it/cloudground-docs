---
title: cgctl
description: Every cgctl command, its options, the configuration variables and the exit codes.
type: reference
prerequisites:
  - An API token, or an account's email and password
version: unreleased
last_verified: unverified
sidebar_position: 1
---

`cgctl` is a thin client of the panel's API, made for scripts. Every command becomes a single API
request; the API's JSON answer goes, indented, to standard output. To get started see
[API tokens and cgctl](/docs/access/api-tokens-and-cgctl).

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
| `cgctl sites create <domain> <type> [flags-json] [database options] [--json]` | `POST /api/sites` | Creates a site and prints its summary (see [below](#sites-create)). `<type>` is `wordpress`, `woocommerce`, `static`, `php`, `laravel` or `proxy`. `flags-json` is a JSON object with the other creation fields; `domain` and `type` come from the arguments. |
| `cgctl sites delete <site-id>` | `DELETE /api/sites/<id>` | Deletes a site. |
| `cgctl cert issue <site-id>` | `POST /api/sites/<id>/certificate` | Requests the site's certificate. |
| `cgctl purge <site-id> [url ...]` | `POST /api/sites/<id>/purge` | Purges the page cache: only the given URLs, or the whole site without URLs. |
| `cgctl warm <site-id>` | `POST /api/sites/<id>/warm` | Warms the site's cache. |

For example, a WordPress site:

```bash
cgctl --wait sites create example.com wordpress \
  '{"admin_email": "you@example.com", "admin_user": "admin", "admin_password": "<at least 12 characters>"}'
```

#### Create a site {#sites-create}

| Option | Effect |
| --- | --- |
| `--with-database` | Also creates a database for a `php` or `static` site (`create_database: true`). WordPress, WooCommerce and Laravel always have one; a `proxy` never. |
| `--db-name <name>` | The primary database's name. Without it, `site_<id>`. |
| `--db-user <name>` | Its user's name. Without it, `site_<id>`. |
| `--db-password-stdin` | Reads the database password from one line of standard input (at most 4 KiB; empty is an error). |
| `--db-password-file <file>` | Reads the password from a file, without its trailing newline. |
| `--db-password <password>` | The password on the command line. It works, but prints on standard error `cgctl: warning: --db-password puts the password where ps and the shell history show it; use --db-password-stdin or --db-password-file`. |
| `--json` | Prints the API's JSON answer instead of the summary. |

Without a password, the panel generates one. The options also take the form `--option=value`, and win
over the same fields in `flags-json`. An unknown option, an option without its value, two of the
password options together, an unreadable file or more than three positional arguments is a usage
error (exit 2). The names and the password follow the [database rules](/docs/reference/database-names-and-passwords).

The summary, in plain text: the site and its state (`Being created: task <id>`, or with `--wait`
`Created.`), then the URL and the panel link, WordPress's admin URL and user, the database's host,
port, socket, name, user and password, and SFTP (off on a new site). It ends with a reminder that the
password is shown only now: the API's answer is the only place it appears.

```bash
cgctl --wait sites create shop.example.com laravel \
  --db-name shop --db-user shop_app --db-password-file /root/shop-db.pass
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
| `cgctl backup restore <backup-id> <domain> [full\|files\|database] [--database <name> ...]` | `POST /api/backups/<id>/restore` | Restores the backup. `<domain>` is the confirmation and must be the site's domain; the default mode is `full`. Since v0.2.0, each `--database <name>` (also `--database=<name>`, anywhere after `backup restore`) restores only that database of the snapshot; without it, every one. See [which databases](/docs/data/restore-a-backup#databases). |
| `cgctl database list <site-id>` | `GET /api/sites/<id>/databases` | The site's databases, with sizes and tables, and the database users with their privileges. |
| `cgctl database create <site-id> <name>` | `POST /api/sites/<id>/databases` | Creates a database of the site. |
| `cgctl database user-create <site-id> <name> [database:all\|read ...]` | `POST /api/sites/<id>/database-users` | Creates a database user with the given privileges; the generated password appears once. |
| `cgctl database import <site-id> <domain> <file.sql> [database]` | `POST /api/sites/<id>/database/import` | Imports a SQL file, into the primary database or the one named. The path is relative to the site's folder; `<domain>` is the confirmation. A rollback point is saved first. |
| `cgctl cron run <cron-id>` | `POST /api/cron/<id>/run` | Runs a scheduled task now. |

### SFTP {#sftp}

*Since v0.2.0.*

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl sftp keys <site-id>` | `GET /api/sites/<id>/ssh-keys` | The site's SSH keys and the SSH port. |
| `cgctl sftp keys-only <site-id> [public-key-file]` | `POST /api/sites/<id>/sftp` | Turns SFTP access on with SSH keys only (or switches to it). With a file (`-` is standard input), adds that key first. |
| `cgctl sftp password <site-id>` | `POST /api/sites/<id>/sftp` | Turns SFTP access on with a password, read as one line from standard input (never from the arguments). |
| `cgctl sftp off <site-id>` | `POST /api/sites/<id>/sftp` | Turns SFTP access off. |

### Protected paths {#protect}

*Since v0.2.0.* See [protect a path](/docs/access/protected-paths).

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl protect add <site-id> <path> <username>` | `POST /api/sites/<id>/protected-paths` | Protects `<path>` with a username and password, or changes its credentials. The password is one line of standard input (at most 4 KiB; empty is a usage error), never an argument. Prints the site's protected paths. |
| `cgctl protect remove <site-id> <path>` | `DELETE /api/sites/<id>/protected-paths` | Stops protecting `<path>`. The path goes in the request body, not in the URL. |

For example, with the password in a file:

```bash
cgctl protect add 3 /wp-admin editor < password.txt
```

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

### Blocking {#blocklist}

*Since v0.3.0.* See [block addresses that keep failing to sign in](/docs/access/block-addresses) and
[refuse visitors](/docs/access/refuse-visitors). Changes to the block list are session-only routes:
these commands sign in with an email and password (and `CLOUDGROUND_TOTP`), not with a token. On the
server, over the API socket, they work as root even if you are blocked out.

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl blocklist` | `GET /api/blocklist` | The block list: blocked and always allowed addresses, settings, and whether the server enforces it. |
| `cgctl blocklist block <address-or-network> [minutes]` | `POST /api/blocklist/blocks` | Blocks an address or a network. `minutes` is an integer from 0 (until removed, the default) to 525600. |
| `cgctl blocklist unblock <address-or-network>` | `DELETE /api/blocklist/blocks` | Removes the block. |
| `cgctl blocklist allow <address-or-network>` | `POST /api/blocklist/allowed` | Always allows the address or network. |
| `cgctl blocklist disallow <address-or-network>` | `DELETE /api/blocklist/allowed` | Takes the address off the always allowed list. |
| `cgctl sites block <site-id> '<rules-json>'` | `PUT /api/sites/<id>/blocking` | Sets the site's rules: `{"addresses": [...], "user_agents": [...], "countries": [...], "allow_countries_only": false}`. `'{}'` removes them. JSON that does not parse is a usage error (exit 2). |

The address goes in the request body, never in the URL.

The security checks' settings change with `cgctl settings set`: `malware_scan` (`1` or `0`, off by
default) and `vulnerability_check` (`1` or `0`, on by default).

### API tokens {#tokens}

These commands always sign in with email and password (`CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`
and, with 2FA, `CLOUDGROUND_TOTP`): the API does not take a token to manage tokens.

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl tokens list` | `GET /api/tokens` | Lists the tokens. |
| `cgctl tokens create <name> [days]` | `POST /api/tokens` | Creates a token; `days` from 0 (never) to 365. The token is shown once. |
| `cgctl tokens revoke <token-id>` | `DELETE /api/tokens/<id>` | Revokes a token. |

### On the server {#on-the-server}

These commands run as root on the server and do not talk to the panel.

| Command | What it does |
| --- | --- |
| `cgctl install [--plan] [--from <dir> \| --release <dir>] [--skip-packages] [--container]` | Installs CloudGround, or repairs a server running the same release (another release goes in with `cgctl update`); `--plan` shows what would change without changing anything. It is the command `install.sh` runs. |
| `cgctl doctor [--skip-packages] [--container]` | Checks every installation step and reports what does not match; exits with 1 when it finds differences, otherwise prints `no drift`. |
| `cgctl update [--to <vX.Y.Z>] [--channel stable\|beta] [--check] [--timeout <duration>]` | Updates CloudGround to a newer signed release, with a snapshot and an automatic rollback, like the panel's **Update now**; `--check` only says what would be installed. See [update CloudGround](/docs/server/update-cloudground). |
| `cgctl uninstall [--plan] [--yes] [--remove-sites [--confirm <hostname>]] [--purge-packages]` | Removes CloudGround from the server, keeping the sites and their databases unless `--remove-sites`; `--plan` lists every action without changing anything. See [uninstall CloudGround](/docs/server/uninstall-cloudground). |
| `cgctl release verify <dir> [file ...]` | Checks a downloaded release against the signing keys built into cgctl; needs neither the panel nor a token. |

## Authentication {#authentication}

1. With a token (`CLOUDGROUND_TOKEN` or `CLOUDGROUND_TOKEN_FILE`), every request carries
   `Authorization: Bearer <token>`.
2. Without a token, `CLOUDGROUND_EMAIL` and `CLOUDGROUND_PASSWORD` (and `CLOUDGROUND_TOTP`) sign in
   once for the command, on the `unix://` socket too.
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

The API's answer goes to standard output, as indented JSON; `sites create` prints its
[summary](#sites-create) instead. Errors go to standard error as
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

For what cgctl does not cover, use the [API](/docs/api) directly.
