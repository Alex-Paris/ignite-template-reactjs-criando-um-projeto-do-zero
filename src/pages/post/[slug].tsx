import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { predicate } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: RichTextField;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main>
        {!post ? (
          <h1>CHora concorrencia</h1>
        ) : (
          <>
            <Header />

            {post.data.banner.url && (
              <img
                className={styles.postBanner}
                src={post.data.banner.url}
                alt="banner"
              />
            )}

            <article
              className={`${commonStyles.contentContainer} ${styles.post}`}
            >
              <h1>{post.data.title}</h1>

              <div className={commonStyles.contentPostsAuthor}>
                <div>
                  <FiCalendar size="1.25rem" />
                  <time>{post.first_publication_date}</time>
                </div>
                <div>
                  <FiUser size="1.25rem" />
                  {post.data.author}
                </div>
                <div>
                  <FiClock size="1.25rem" />5 min.
                </div>
              </div>

              <div className={styles.postContent}>
                {post.data.content.map(content => (
                  <>
                    <h2>{content.heading}</h2>
                    <PrismicRichText field={content.body} />
                  </>
                ))}
              </div>
            </article>
          </>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.get({
    predicates: [predicate.at('document.type', 'posts')],
    pageSize: 3,
  });

  const paths = response.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: response.data,
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 1, // 30 minutes
  };
};
