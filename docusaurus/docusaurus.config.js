// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Compose Destinations',
  tagline: 'Make your Jetpack Compose navigation code pleasant',
  url: 'https://composedestinations.rafaelcosta.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'raamcosta', // Usually your GitHub org/user name.
  projectName: 'compose-destinations-docs', // Usually your repo name.

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/',
          versions: {
            current: {
              label: '2.x',
              path: 'v2' // change to '' when we want to make v2 the default
            },
            "1.x": {
              label: '1.x',
              path: '', // change to v1 when we want to make v2 the default
            }
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
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
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'migrating-to-v2',
            label: 'Migrate to v2',
            position: 'left',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
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
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
    themes: [
       '@docusaurus/theme-mermaid',
      [
        require.resolve("@easyops-cn/docusaurus-search-local"),
        {
          docsRouteBasePath: "/",
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

export default config;
