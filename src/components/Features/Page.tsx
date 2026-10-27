import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Redirect} from '@docusaurus/router';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {featuresPath} from '@site/src/data/site';
import Features from './index';

/**
 * The features page is /funzionalita in Italian and /en/features in English.
 * Both files of src/pages render this: the one that matches the language
 * shows the page, the other one sends the reader to it (the language switch
 * keeps the path, so /en/funzionalita and /features must lead somewhere).
 */
export default function FeaturesPage({path}: {path: string}): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const own = featuresPath(i18n.currentLocale);
  const target = useBaseUrl(own);
  if (path !== own) {
    return (
      <Layout noFooter>
        <Head>
          <meta name="robots" content="noindex" />
          <meta httpEquiv="refresh" content={`0; url=${target}`} />
          <link rel="canonical" href={`${siteConfig.url}${target}`} />
        </Head>
        <Redirect to={own} />
        <main className="container margin-vert--xl">
          <Link to={own}>
            <Translate id="features.moved">Le funzionalità sono qui</Translate>
          </Link>
        </main>
      </Layout>
    );
  }
  const title = translate({id: 'features.meta.title', message: 'Funzionalità — CloudGround'});
  const description = translate({
    id: 'features.meta.description',
    message:
      'Tutto quello che fa CloudGround sul tuo server Ubuntu: velocità, siti e app, rilasci, dati, sicurezza, visibilità e accesso, con la guida di ogni funzione.',
  });
  return (
    <Layout description={description}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
      </Head>
      <Features />
    </Layout>
  );
}
