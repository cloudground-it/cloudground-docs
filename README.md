# CloudGround documentation

The user documentation for [CloudGround](https://github.com/cloudground-it/cloudground): how
to install it, run sites on it and look after the server. It is published as the docs site of
the project.

## Structure

| Section | What it covers |
| --- | --- |
| `docs/getting-started/` | requirements, one-command install, first sign-in, panel domain and certificate |
| `docs/sites/` | creating sites (WordPress, WooCommerce, PHP, Laravel, static, reverse proxy), domains and aliases, SSL, staging, deploys, files, SFTP and SSH keys, cron, databases |
| `docs/performance/` | the page cache, PHP tuning, object cache, what the defaults are and how they were measured |
| `docs/backups/` | off-site repositories (S3, R2, SFTP…), schedules and retention, verified restores |
| `docs/security/` | isolation between sites, users and roles, two-factor sign-in, the firewall, updates |
| `docs/administration/` | services, logs, alerts and notifications, upgrades, moving to another server |
| `docs/cli/` | `cgctl`, generated from the code |
| `docs/api/` | the HTTP API, generated from the code |
| `docs/troubleshooting/` | known problems and how to read the logs |

## Writing rules

1. **Describe what the product does, measured on a server.** Every command, path, port and
   screenshot comes from a real install of the version the page names.
2. **No third-party product names** (other panels or hosts) and no comparisons with them.
3. **Written from scratch.** Nothing is copied from another project's documentation.
4. Italian and English, with the same page in both languages.

## Status

Initialised on 2026-10-09. The site generator (Docusaurus) and the content come with
Phase 9 of the CloudGround rewrite plan.
