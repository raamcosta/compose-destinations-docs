// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Compose Destinations',
  tagline: 'Make your Jetpack Compose navigation code pleasant',
  url: 'https://composedestinations.rafaelcosta.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'raamcosta', // Usually your GitHub org/user name.
  projectName: 'compose-destinations-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Compose Destinations',
        logo: {
          alt: 'Compose Destinations Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/raamcosta/compose-destinations',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Compose Destinations, Rafael Costa. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['kotlin', 'groovy'],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
    themes: [
      [
        require.resolve("@easyops-cn/docusaurus-search-local"),
        {
          indexPages: true,
          indexBlog: false,
          removeDefaultStopWordFilter: true,
          removeDefaultStemmer: true,
          highlightSearchTermsOnTargetPage: true,

          // `hashed` is recommended as long-term-cache of index file is possible.
          hashed: true,
        },
      ],
    ],
};

module.exports = config;
