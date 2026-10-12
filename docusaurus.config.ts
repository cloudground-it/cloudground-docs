import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PrismTheme} from 'prism-react-renderer';
import path from 'node:path';

const REPO = 'https://github.com/cloudground-it/cloudground';
const DOCS_REPO = 'https://github.com/cloudground-it/cloudground-docs';

// Sections that have their own sidebar and navbar entry, kept out of the guide.
const OWN_SIDEBAR = ['cli', 'api'];

// Code is always set on ink (--cg-code-bg): one theme for light and dark.
// Every colour reaches 4.5:1 on #15161A and on #0B0C0E.
const inkPrism: PrismTheme = {
  plain: {color: '#F2F0EA', backgroundColor: '#15161A'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#A6A59E'}},
    {types: ['punctuation', 'operator'], style: {color: '#C9C7BF'}},
    {types: ['string', 'char', 'attr-value', 'url'], style: {color: '#B4C3FF'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#F5B08A'}},
    {types: ['keyword', 'builtin', 'important', 'atrule'], style: {color: '#93A8FF'}},
    {types: ['function', 'class-name', 'selector', 'tag'], style: {color: '#F2F0EA'}},
    {types: ['variable', 'property', 'attr-name', 'parameter'], style: {color: '#D8DFFF'}},
    {types: ['deleted'], style: {color: '#FF8073'}},
    {types: ['inserted'], style: {color: '#63CF8A'}},
  ],
};

const config: Config = {
  title: 'CloudGround',
  tagline: 'Hosting che si misura',
  favicon: 'img/favicon.svg',

  url: 'https://cloudground.it',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'cloudground-it',
  projectName: 'cloudground-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  // The date the site was built: the "Data" of the home's test report.
  customFields: {
    buildDate: new Date().toISOString().slice(0, 10),
  },

  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    localeConfigs: {
      it: {label: 'Italiano', htmlLang: 'it'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },

  headTags: [
    // Motion is allowed: the home keeps its hero hidden until GSAP plays it
    // (src/components/Home/useHomeMotion.ts). Without JavaScript nothing hides.
    // An attribute, not a class: the head manager rewrites <html class>.
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-cg-motion','on')",
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/IBMPlexSans-Latin.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: `${DOCS_REPO}/edit/main/`,
          editLocalizedFiles: true,
          showLastUpdateTime: false,
          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
            const items = await defaultSidebarItemsGenerator(args);
            if (args.item.dirName !== '.') {
              return items;
            }
            return items.filter(
              (item) =>
                !(
                  item.type === 'category' &&
                  item.link?.type === 'doc' &&
                  OWN_SIDEBAR.some((dir) => item.link?.type === 'doc' && item.link.id.startsWith(`${dir}/`))
                ),
            );
          },
        },
        blog: false,
        pages: {},
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: null,
          // The search results page is nobody's document.
          ignorePatterns: ['/search', '/en/search'],
        },
      } satisfies Preset.Options,
    ],
  ],

  // Cross-tab colour-mode sync without the echo of issue #12.
  clientModules: ['./src/clientModules/colorModeSync.ts'],

  plugins: [
    // trailingSlash is false, so /docs is docs.html and the folder docs/ has
    // no index: GitHub Pages answers /docs/ with a 404. Give every page whose
    // folder lacks an index a small page there that sends to the address
    // without the slash, keeping the query and the anchor.
    () => ({
      name: 'slash-redirects',
      async postBuild({outDir, baseUrl, routesPaths, siteConfig}) {
        const fs = await import('node:fs/promises');
        const exists = (p: string) =>
          fs.access(p).then(
            () => true,
            () => false,
          );
        for (const route of new Set(routesPaths)) {
          if (route.endsWith('/') || !route.startsWith(baseUrl)) {
            continue;
          }
          const rel = route.slice(baseUrl.length);
          const index = path.join(outDir, rel, 'index.html');
          if (!(await exists(path.join(outDir, `${rel}.html`))) || (await exists(index))) {
            continue;
          }
          const url = JSON.stringify(route);
          const href = route.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
          await fs.mkdir(path.dirname(index), {recursive: true});
          await fs.writeFile(
            index,
            `<!doctype html><html><head><meta charset="utf-8"><title>CloudGround</title>` +
              `<meta name="robots" content="noindex"><link rel="canonical" href="${siteConfig.url}${href}">` +
              `<script>location.replace(${url}+location.search+location.hash)</script>` +
              `<meta http-equiv="refresh" content="0; url=${href}"></head>` +
              `<body><a href="${href}">${href}</a></body></html>`,
          );
        }
      },
    }),
    // The search results draw their icons from a module of HTML strings:
    // swap it for ours (src/components/Icon/searchHitIcons.ts).
    () => ({
      name: 'search-icons',
      configureWebpack: (_config, _isServer, {currentBundler}) => ({
        plugins: [
          new currentBundler.instance.NormalModuleReplacementPlugin(/^\.\/icons$/, (resource) => {
            if (/docusaurus-search-local[\\/].*[\\/]SearchBar$/.test(resource.context)) {
              resource.request = path.resolve(__dirname, 'src/components/Icon/searchHitIcons.ts');
            }
          }),
        ],
      }),
    }),
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['it', 'en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: 'docs',
        highlightSearchTermsOnTargetPage: false,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchResultLimits: 8,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    // The card social networks show for every page: 1200×630, the lockup and
    // the line "Hosting che si misura" (brand files, static/img/og.png).
    image: 'img/og.png',
    metadata: [
      {name: 'theme-color', content: '#fbfaf6', media: '(prefers-color-scheme: light)'},
      {name: 'theme-color', content: '#131418', media: '(prefers-color-scheme: dark)'},
      {name: 'referrer', content: 'strict-origin-when-cross-origin'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {hideable: false, autoCollapseCategories: false},
    },
    navbar: {
      // The lockup (mark and wordmark), shown at the top of the mobile drawer.
      // The bar itself draws the mark inline (src/theme/Navbar/Content).
      logo: {alt: 'CloudGround', src: 'img/logo.svg', srcDark: 'img/logo-dark.svg', width: 128, height: 25},
      items: [
        {type: 'docSidebar', sidebarId: 'guide', position: 'left', label: 'Guida'},
        {type: 'docSidebar', sidebarId: 'cli', position: 'left', label: 'CLI'},
        {type: 'docSidebar', sidebarId: 'api', position: 'left', label: 'API'},
        {href: `${REPO}/releases`, position: 'left', label: 'Novità', className: 'cg-nav-releases'},
        {type: 'localeDropdown', position: 'right', className: 'cg-locale'},
        {href: REPO, position: 'right', label: 'GitHub', className: 'cg-nav-github'},
      ],
    },
    footer: {
      style: 'dark',
      links: [],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    // Diagrams take their colours from the theme tokens: the base theme with
    // the light palette here, and custom.css (section Mermaid) maps every
    // fill and stroke to the --cg-* variables, so dark mode follows.
    mermaid: {
      theme: {light: 'base', dark: 'base'},
      options: {
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        themeVariables: {
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontSize: '14px',
          primaryColor: '#f3f1ea',
          primaryTextColor: '#15161a',
          primaryBorderColor: '#86837a',
          secondaryColor: '#fbfaf6',
          tertiaryColor: '#fbfaf6',
          lineColor: '#5b5d64',
          textColor: '#15161a',
          mainBkg: '#f3f1ea',
          clusterBkg: '#fbfaf6',
          clusterBorder: '#d6d3c8',
          edgeLabelBackground: '#fbfaf6',
          noteBkgColor: '#fbfaf6',
          noteBorderColor: '#2343c2',
          actorBkg: '#f3f1ea',
          actorBorder: '#86837a',
          signalColor: '#15161a',
        },
      },
    },
    prism: {
      theme: inkPrism,
      darkTheme: inkPrism,
      additionalLanguages: ['bash', 'nginx', 'ini', 'php'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
