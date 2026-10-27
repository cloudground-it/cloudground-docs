---
title: cgctl
description: Every cgctl command and option, the configuration variables and the exit codes.
type: reference
prerequisites:
  - An API token, or an account's email and password
version: v0.3.0
last_verified: unverified
sidebar_position: 1
---

`cgctl` is a thin command-line client for the panel's API, built for scripting. Each command maps to
a single API request, and the API's JSON response is printed, indented, to standard output. To get
started, see [API tokens and cgctl](/docs/access/api-tokens-and-cgctl).

## Syntax {#syntax}

```text
cgctl [--wait|-w] [--timeout <duration>] <command> [arguments]
```

| Option | Effect |
| --- | --- |
| `--wait`, `-w` | If the response names a task, follows it until it finishes (see [below](#wait)). |
| `--timeout <duration>` | How long `--wait` waits, for example `30m` or `2h`. Default `1h`. |
| `--` | Ends the options. Everything after it is the command. |
| `-v`, `--version`, `version` | Prints `cgctl <version>` and exits with 0, without reading the configuration. |
| `-h`, `--help`, `help` | Prints usage and exits with 2. Same with no command. |

Options can go anywhere on the command line. Arguments that are IDs must be positive integers.

## Commands {#commands}

### Sites {#sites}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl sites list` | `GET /api/sites` | Lists the sites. |
| `cgctl sites create <domain> <type> [flags-json] [database options] [--json]` | `POST /api/sites` | Creates a site and prints a summary (see [below](#sites-create)). `<type>` is `wordpress`, `woocommerce`, `static`, `php`, `laravel` or `proxy`. `flags-json` is a JSON object with any other creation fields. `domain` and `type` come from the arguments. |
| `cgctl sites delete <site-id>` | `DELETE /api/sites/<id>` | Deletes a site. |
| `cgctl cert issue <site-id>` | `POST /api/sites/<id>/certificate` | Requests the site's certificate. |
| `cgctl purge <site-id> [url ...]` | `POST /api/sites/<id>/purge` | Purges the page cache: just the given URLs, or the whole site if you pass none. |
| `cgctl warm <site-id>` | `POST /api/sites/<id>/warm` | Warms the site's cache. |
| `cgctl cleanup <site-id> on [revisions]\|off\|preview\|run` | `PUT /api/sites/<id>/wp/cleanup`, `POST …/cleanup/preview`, `…/cleanup/run` | The [weekly cleanup](/docs/sites/clean-the-wordpress-database) of a WordPress site: turn it on (with how many revisions of each post stay, 1 to 100) or off, run the dry run, or clean now. |
| `cgctl maintenance <site-id> <on\|off> [message]` | `PUT /api/sites/<id>/maintenance` | Turns the [maintenance page](/docs/sites/maintenance-page) on or off, with its text if you give one. |
| `cgctl devmode <site-id> <15\|30\|60\|off>` | `PUT /api/sites/<id>/dev-mode` | Bypasses the page cache for 15, 30 or 60 minutes ([development mode](/docs/sites/development-mode)), or ends it now. |

For example, to create a WordPress site:

```bash
cgctl --wait sites create example.com wordpress \
  '{"admin_email": "you@example.com", "admin_user": "admin", "admin_password": "<at least 12 characters>"}'
```

#### Create a site {#sites-create}

| Option | Effect |
| --- | --- |
| `--with-database` | Also creates a database for a `php` or `static` site (`create_database: true`). WordPress, WooCommerce and Laravel sites always get one; `proxy` sites never do. |
| `--db-name <name>` | The primary database's name. Defaults to `site_<id>`. |
| `--db-user <name>` | Its user's name. Defaults to `site_<id>`. |
| `--db-password-stdin` | Reads the database password from one line of standard input (up to 4 KiB; empty is an error). |
| `--db-password-file <file>` | Reads the password from a file, minus its trailing newline. |
| `--db-password <password>` | Takes the password on the command line. It works, but prints `cgctl: warning: --db-password puts the password where ps and the shell history show it; use --db-password-stdin or --db-password-file` to standard error. |
| `--json` | Prints the API's JSON response instead of the summary. |

Without a password, the panel generates one. Options also accept the `--option=value` form, and
override the same fields in `flags-json`. An unknown option, an option missing its value, two
password options at once, an unreadable file, or more than three positional arguments is a usage
error (exit 2). Names and passwords follow the [database rules](/docs/reference/database-names-and-passwords).

The summary is plain text: the site and its state (`Being created: task <id>`, or `Created.` with
`--wait`), then the URL and panel link, the WordPress admin URL and user, the database host, port,
socket, name, user and password, and SFTP (off on a new site). It ends with a reminder that the
password is only shown now: the API response is the only place it ever appears.

```bash
cgctl --wait sites create shop.example.com laravel \
  --db-name shop --db-user shop_app --db-password-file /root/shop-db.pass
```

### Staging and releases {#staging-and-releases}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl staging create <site-id>` | `POST /api/sites/<id>/staging` | Creates the staging copy. |
| `cgctl safe-push <site-id> [path ...]` | `POST /api/sites/<id>/safe-push` | Ships staging to production with Safe Push. The `path` arguments are the URL paths Performance Guard measures (for example `/` and `/shop/`). |
| `cgctl deploy <site-id> <folder>` | `POST /api/sites/<id>/deployments` | Deploys a release from a folder inside the site (`source_dir`). |
| `cgctl rollback <site-id>` | `POST /api/sites/<id>/rollback` | Rolls back to the previous release. |

### Backups and databases {#backups-and-database}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl backup run <site-id>` | `POST /api/sites/<id>/backups` | Takes a backup now. |
| `cgctl backup verify <backup-id>` | `POST /api/backups/<id>/verify` | Runs a restore test on the backup. |
| `cgctl backup restore <backup-id> <domain> [full\|files\|database] [--database <name> ...]` | `POST /api/backups/<id>/restore` | Restores the backup. `<domain>` is the confirmation and must match the site's domain. The default mode is `full`. Since v0.2.0, each `--database <name>` (or `--database=<name>`, anywhere after `backup restore`) restores only that database from the snapshot. Without it, all of them are restored. See [choose which databases to restore](/docs/data/restore-a-backup#databases). |
| `cgctl database list <site-id>` | `GET /api/sites/<id>/databases` | The site's databases, with sizes and tables, and the database users with their privileges. |
| `cgctl database create <site-id> <name>` | `POST /api/sites/<id>/databases` | Creates a database for the site. |
| `cgctl database user-create <site-id> <name> [database:all\|read ...]` | `POST /api/sites/<id>/database-users` | Creates a database user with the given privileges. The generated password is shown once. |
| `cgctl database import <site-id> <domain> <file.sql> [database]` | `POST /api/sites/<id>/database/import` | Imports a SQL file into the primary database, or into the one you name. The path is relative to the site folder, and `<domain>` is the confirmation. A rollback point is saved first. |
| `cgctl cron run <cron-id>` | `POST /api/cron/<id>/run` | Runs a scheduled task now. |

### SFTP {#sftp}

*Since v0.2.0.*

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl sftp keys <site-id>` | `GET /api/sites/<id>/ssh-keys` | The site's SSH keys and the SSH port. |
| `cgctl sftp keys-only <site-id> [public-key-file]` | `POST /api/sites/<id>/sftp` | Turns on SFTP with SSH keys only (or switches to key-only). With a file (`-` for standard input), adds that key first. |
| `cgctl sftp password <site-id>` | `POST /api/sites/<id>/sftp` | Turns on SFTP with a password, read as one line from standard input (never from the arguments). |
| `cgctl sftp off <site-id>` | `POST /api/sites/<id>/sftp` | Turns SFTP off. |

### Protected paths {#protect}

*Since v0.2.0.* See [protect a path](/docs/access/protected-paths).

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl protect add <site-id> <path> <username>` | `POST /api/sites/<id>/protected-paths` | Protects `<path>` with a username and password, or changes its credentials. The password is read as one line from standard input (up to 4 KiB; empty is a usage error), never from an argument. Prints the site's protected paths. |
| `cgctl protect remove <site-id> <path>` | `DELETE /api/sites/<id>/protected-paths` | Removes protection from `<path>`. The path goes in the request body, not the URL. |

For example, with the password in a file:

```bash
cgctl protect add 3 /wp-admin editor < password.txt
```

### Server {#server}

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl status` | `GET /api/system/status` | Server status: CPU, memory, disk, main services. |
| `cgctl drift` | `GET /api/system/drift` | Managed files changed outside the panel. |
| `cgctl tasks` | `GET /api/tasks` | The 100 most recent tasks. |
| `cgctl task <task-id>` | `GET /api/tasks/<id>` | A single task. |
| `cgctl audit` | `GET /api/audit` | The 200 most recent audit log entries. |
| `cgctl settings get` | `GET /api/settings` | The panel's settings. |
| `cgctl settings set <key> <value>` | `PUT /api/settings` | Changes one setting. |

### Blocking {#blocklist}

*Since v0.3.0.* See [block addresses that keep failing to sign in](/docs/access/block-addresses) and
[refuse visitors](/docs/access/refuse-visitors). Block list changes go through session-only routes,
so these commands sign in with email and password (plus `CLOUDGROUND_TOTP`) rather than a token. On
the server, over the API socket, they work as root even if your own address is blocked.

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl blocklist` | `GET /api/blocklist` | The block list: blocked and always-allowed addresses, settings, and whether the server is enforcing it. |
| `cgctl blocklist block <address-or-network> [minutes]` | `POST /api/blocklist/blocks` | Blocks an address or network. `minutes` is an integer from 0 (until removed, the default) to 525600. |
| `cgctl blocklist unblock <address-or-network>` | `DELETE /api/blocklist/blocks` | Removes the block. |
| `cgctl blocklist allow <address-or-network>` | `POST /api/blocklist/allowed` | Always allows the address or network. |
| `cgctl blocklist disallow <address-or-network>` | `DELETE /api/blocklist/allowed` | Removes the address from the always-allowed list. |
| `cgctl sites block <site-id> '<rules-json>'` | `PUT /api/sites/<id>/blocking` | Sets the site's rules: `{"addresses": [...], "user_agents": [...], "countries": [...], "allow_countries_only": false}`. `'{}'` clears them. Invalid JSON is a usage error (exit 2). |

The address goes in the request body, never in the URL.

Security check settings are changed with `cgctl settings set`: `malware_scan` (`1` or `0`, off by
default) and `vulnerability_check` (`1` or `0`, on by default).

### API tokens {#tokens}

These commands always sign in with email and password (`CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`
and, with 2FA, `CLOUDGROUND_TOTP`), because the API doesn't accept a token for managing tokens.

| Command | Request | What it does |
| --- | --- | --- |
| `cgctl tokens list` | `GET /api/tokens` | Lists tokens. |
| `cgctl tokens create <name> [days]` | `POST /api/tokens` | Creates a token. `days` ranges from 0 (never expires) to 365. The token is shown once. |
| `cgctl tokens revoke <token-id>` | `DELETE /api/tokens/<id>` | Revokes a token. |

### On the server {#on-the-server}

These commands run as root on the server and don't talk to the panel.

| Command | What it does |
| --- | --- |
| `cgctl install [--plan] [--from <dir> \| --release <dir>] [--skip-packages] [--container]` | Installs CloudGround, or repairs a server running the same release (use `cgctl update` to move to a different release). `--plan` shows what would change without changing anything. This is the command `install.sh` runs. |
| `cgctl doctor [--skip-packages] [--container]` | Checks every installation step and reports anything that doesn't match. Exits with 1 if it finds differences, otherwise prints `no drift`. |
| `cgctl update [--to <vX.Y.Z>] [--channel stable\|beta] [--check] [--timeout <duration>]` | Updates CloudGround to a newer signed release, with a snapshot and automatic rollback, just like the panel's **Update now**. `--check` only reports what would be installed. See [update CloudGround](/docs/server/update-cloudground). |
| `cgctl uninstall [--plan] [--yes] [--remove-sites [--confirm <hostname>]] [--purge-packages]` | Removes CloudGround from the server, keeping the sites and their databases unless you pass `--remove-sites`. `--plan` lists every action without changing anything. See [uninstall CloudGround](/docs/server/uninstall-cloudground). |
| `cgctl release verify <dir> [file ...]` | Verifies a downloaded release against the signing keys built into cgctl. Needs neither the panel nor a token. |

## Authentication {#authentication}

1. With a token (`CLOUDGROUND_TOKEN` or `CLOUDGROUND_TOKEN_FILE`), every request carries
   `Authorization: Bearer <token>`.
2. Without a token, `CLOUDGROUND_EMAIL` and `CLOUDGROUND_PASSWORD` (plus `CLOUDGROUND_TOTP`) sign in
   once per command, including over the `unix://` socket.
3. With neither, cgctl exits with 1 and explains how to get a token.

## Configuration {#configuration}

cgctl reads its settings in this order, each overriding the previous: built-in defaults, the file
`/etc/cloudground/cgctl.env` (or the file named in `CLOUDGROUND_CONFIG`), then the environment. The
file has one `KEY=value` line per variable. Blank lines and lines starting with `#` or `;` are
ignored. If the user can't read the file, it's ignored.

| Variable | Default | Value |
| --- | --- | --- |
| `CLOUDGROUND_URL` | `unix:///run/cloudground/api.sock` | `unix://<absolute path>`, `https://host[:port]`, or `http://` to a local address only. |
| `CLOUDGROUND_TOKEN` | — | A token: `cgt_` followed by 43 base64url characters. |
| `CLOUDGROUND_TOKEN_FILE` | — | A file containing the token. |
| `CLOUDGROUND_INSECURE` | off | `1` skips certificate verification for non-local addresses. |
| `CLOUDGROUND_EMAIL`, `CLOUDGROUND_PASSWORD`, `CLOUDGROUND_TOTP` | — | Password sign-in, without a token. |
| `CLOUDGROUND_CONFIG` | — | A file to read instead of `/etc/cloudground/cgctl.env`. |

The token and the token file count as one setting: the environment wins over the file, and within a
single source the token wins over the token file. Switches take `1` (on), or empty or `0` (off). Any
other value is an error. Every configuration error names the variable and where it was set.

With `https://`, cgctl verifies the certificate, unless the address is local or
`CLOUDGROUND_INSECURE=1` is set. cgctl doesn't use a proxy.

## Output and errors {#output}

The API's response goes to standard output as indented JSON. `sites create` prints its
[summary](#sites-create) instead. Errors go to standard error as
`cgctl: HTTP <status>: <the API's error>`.

## Waiting for a task {#wait}

With `--wait`, when the response names a task, cgctl polls `GET /api/tasks/<id>` every second and
prints a progress line to standard error whenever something changes. It stops once the status is
final: `succeeded` means success; `failed`, `cancelled`, or any status other than `pending`, `queued`
and `running` means failure. The final task is printed to standard output.

If the panel stops responding while cgctl is waiting (during a restart, for example), cgctl keeps
retrying. A 401, 403 or 404 response ends the wait as a failure. If the response doesn't name a task,
`--wait` has no effect.

## Exit codes {#exit-codes}

| Code | Meaning |
| --- | --- |
| `0` | The request succeeded and, with `--wait`, so did the task. |
| `1` | The API refused the request or couldn't be reached, or the task failed. |
| `2` | Usage or configuration error. |
| `3` | With `--wait`, `--timeout` expired while the task was still running. |

## Next step {#next}

For anything cgctl doesn't cover, call the [API](/docs/api) directly.
