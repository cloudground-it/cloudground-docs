import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PrismTheme} from 'prism-react-renderer';
import path from 'node:path';

const REPO = 'https://github.com/cloudground-it/cloudground';
const DOCS_REPO = 'https://github.com/cloudground-it/cloudground-docs';

// Sections that have their own sidebar and navbar entry, kept out of the guide.
const OWN_SIDEBAR = ['cli', 'api'];

// Code is always dark (--cg-code-bg): one theme for light and dark.
// Every colour reaches 4.5:1 on #0E1220 and on #090B10.
const inkPrism: PrismTheme = {
  plain: {color: '#E8ECF6', backgroundColor: '#0E1220'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#9AA3B8'}},
    {types: ['punctuation', 'operator'], style: {color: '#C3CAD8'}},
    {types: ['string', 'char', 'attr-value', 'url'], style: {color: '#B4C3FF'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#F2C063'}},
    {types: ['keyword', 'builtin', 'important', 'atrule'], style: {color: '#8AA2FF'}},
    {types: ['function', 'class-name', 'selector', 'tag'], style: {color: '#E8ECF6'}},
    {types: ['variable', 'property', 'attr-name', 'parameter'], style: {color: '#D6DEFF'}},
    {types: ['deleted'], style: {color: '#FF8A80'}},
    {types: ['inserted'], style: {color: '#5FD39A'}},
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
    // The favicon is the pixel mark (static/img/favicon.svg, also favicon.ico);
    // home screens get the blue tile.
    {tagName: 'link', attributes: {rel: 'icon', href: '/favicon.ico', sizes: '48x48'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/icon-192.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '512x512', href: '/img/icon-512.png'}},
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
    // no index: GitHub Pages answers /docs/ with its 404 page. That page
    // (404.html at the root serves every locale) drops the trailing slash and
    // tries again, keeping the query and the anchor. A page that really does
    // not exist then shows the 404 without the slash; no redirect files sit
    // next to the pages, so `docusaurus serve` keeps working.
    () => ({
      name: 'slash-redirects',
      async postBuild({outDir}) {
        const fs = await import('node:fs/promises');
        const file = path.join(outDir, '404.html');
        const html = await fs.readFile(file, 'utf8');
        const script =
          "<script>(function(l){var p=l.pathname;if(p.length>1&&p.slice(-1)==='/')" +
          "l.replace(p.replace(/\\/+$/,'')+l.search+l.hash)})(location)</script>";
        if (!html.includes('<head>')) {
          throw new Error('404.html has no <head>');
        }
        await fs.writeFile(file, html.replace('<head>', `<head>${script}`));
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
    // The card social networks show for every page: 1200×630, the mark, the
    // name and the line "Hosting che si misura" (static/img/og.png).
    image: 'img/og.png',
    metadata: [
      {name: 'theme-color', content: '#f9fafc', media: '(prefers-color-scheme: light)'},
      {name: 'theme-color', content: '#0e1117', media: '(prefers-color-scheme: dark)'},
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
      // No logo here: the bar, the drawer and the footer draw the mark inline
      // (src/components/LogoMark).
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
          primaryColor: '#f1f3f8',
          primaryTextColor: '#11141c',
          primaryBorderColor: '#7c8396',
          secondaryColor: '#f9fafc',
          tertiaryColor: '#f9fafc',
          lineColor: '#586074',
          textColor: '#11141c',
          mainBkg: '#f1f3f8',
          clusterBkg: '#f9fafc',
          clusterBorder: '#d7dce7',
          edgeLabelBackground: '#f9fafc',
          noteBkgColor: '#f9fafc',
          noteBorderColor: '#2549e0',
          actorBkg: '#f1f3f8',
          actorBorder: '#7c8396',
          signalColor: '#11141c',
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
