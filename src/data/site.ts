/**
 * The site's facts, typed once. Every address the navbar, the footer and the
 * home lead to comes from here, so a move is one change.
 */
export const REPO = 'https://github.com/cloudground-it/cloudground';
export const DOCS_REPO = 'https://github.com/cloudground-it/cloudground-docs';
export const RELEASE = 'v0.3.2';
export const RELEASE_URL = `${REPO}/releases/tag/${RELEASE}`;
export const RELEASES_URL = `${REPO}/releases`;
export const ISSUES_URL = `${REPO}/issues`;
export const LICENSE_URL = `${REPO}/blob/main/LICENSE`;
export const INSTALL_COMMAND = 'curl -fsSL https://get.cloudground.it | sudo bash';

/**
 * The benchmark the home quotes: bench/phase-10-fresh.md in the product
 * repository, section "The release candidate on the purged box" (the v0.1.0
 * tree, three runs per scenario, the mean). Never type a number on the home
 * that is not in that file.
 */
export const BENCH_URL = `${REPO}/blob/main/bench/phase-10-fresh.md`;
export const BENCH_METHOD_URL = `${REPO}/blob/main/bench/README.md`;
