import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.contentContainer}>
        <div className={styles.contentLogo}>
          <img src="/images/logo.svg" alt="logo" />
        </div>

        <div className={styles.contentPosts}>
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.contentPostsAuthor}>
              <div>
                <FiCalendar size="1.25rem" />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <FiUser size="1.25rem" />
                Joseph Oliveira
              </div>
            </div>
          </a>
        </div>
        <div className={styles.contentPosts}>
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.contentPostsAuthor}>
              <div>
                <FiCalendar size="1.25rem" />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <FiUser size="1.25rem" />
                Joseph Oliveira
              </div>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
