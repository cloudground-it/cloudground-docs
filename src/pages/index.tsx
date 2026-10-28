import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Home from '@site/src/components/Home';
import {RELEASE, REPO} from '@site/src/data/site';

export default function HomePage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const title = translate({id: 'home.meta.title', message: 'CloudGround — Il pannello di hosting per il tuo server Ubuntu'});
  const description = translate({
    id: 'home.meta.description',
    message:
      'Un comando installa il pannello sul tuo server. Ogni sito ha cache, PHP e certificato propri, e ogni backup viene ripristinato per prova.',
  });
  const home = `${siteConfig.url}${useBaseUrl('/')}`;
  // Structured data declares only what the page shows: the name, what it
  // runs on, its price (free) and its licence.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CloudGround',
    url: home,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Ubuntu 24.04, Ubuntu 26.04',
    softwareVersion: RELEASE.replace(/^v/, ''),
    license: 'https://www.elastic.co/licensing/elastic-license',
    sameAs: REPO,
    offers: {'@type': 'Offer', price: '0', priceCurrency: 'EUR'},
  };
  return (
    <Layout description={description}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Head>
      <Home />
    </Layout>
  );
}
