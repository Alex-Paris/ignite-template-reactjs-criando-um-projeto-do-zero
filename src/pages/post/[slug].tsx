import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';

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

      <main className={commonStyles.contentContainer}>
        <img src={post.data.banner.url} alt="banner" />

        <article className={styles.post}>
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
              <FiClock size="1.25rem" />
              {post.data.author}
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
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Set a static variable loadded before in another static page
    paths: [
      // { params: { slug: 'the-meaning-of-life' } }
    ],
    // fallback
    //  true: load the page before getting information from getStaticProps
    //  false: return 404 if getStaticProps was not loadded
    //  blocking: wait server side rendering before showing page
    fallback: 'blocking',
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

  console.log(JSON.stringify(post.data.content, null, 2));

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
