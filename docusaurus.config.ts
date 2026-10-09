import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PrismTheme} from 'prism-react-renderer';

const REPO = 'https://github.com/cloudground-it/cloudground';
const DOCS_REPO = 'https://github.com/cloudground-it/cloudground-docs';

// Sections that have their own sidebar and navbar entry, kept out of the guide.
const OWN_SIDEBAR = ['cli', 'api'];

// Code is always set on ink: one theme for light and dark.
const inkPrism: PrismTheme = {
  plain: {color: '#F2F1EC', backgroundColor: '#0F0F12'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#8A8A92'}},
    {types: ['punctuation', 'operator'], style: {color: '#B7B6AE'}},
    {types: ['string', 'char', 'attr-value', 'url'], style: {color: '#A9BBFF'}},
    {types: ['number', 'boolean', 'constant', 'symbol'], style: {color: '#F0A27E'}},
    {types: ['keyword', 'builtin', 'important', 'atrule'], style: {color: '#E0612B'}},
    {types: ['function', 'class-name', 'selector', 'tag'], style: {color: '#F2F1EC'}},
    {types: ['variable', 'property', 'attr-name', 'parameter'], style: {color: '#D6E0FF'}},
    {types: ['deleted'], style: {color: '#E0612B'}},
    {types: ['inserted'], style: {color: '#A9BBFF'}},
  ],
};

const config: Config = {
  title: 'CloudGround',
  tagline: 'Documentazione',
  favicon: 'img/logo.svg',

  url: 'https://docs.cloudground.it',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'cloudground-it',
  projectName: 'cloudground-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {onBrokenMarkdownLinks: 'throw'},
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
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/Archivo-Variable.woff2',
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
          routeBasePath: '/',
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
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: null,
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['it', 'en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: false,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchResultLimits: 8,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {hideable: false, autoCollapseCategories: false},
    },
    navbar: {
      title: 'cloudground',
      logo: {alt: 'CloudGround', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'guide', position: 'left', label: 'Guida'},
        {type: 'docSidebar', sidebarId: 'cli', position: 'left', label: 'CLI'},
        {type: 'docSidebar', sidebarId: 'api', position: 'left', label: 'API'},
        {href: `${REPO}/releases`, position: 'left', label: 'Novità'},
        {type: 'custom-localeSwitch', position: 'right'},
        {href: REPO, position: 'right', label: 'GitHub ↗', className: 'cg-nav-github'},
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
    prism: {
      theme: inkPrism,
      darkTheme: inkPrism,
      additionalLanguages: ['bash', 'nginx', 'ini', 'php'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
