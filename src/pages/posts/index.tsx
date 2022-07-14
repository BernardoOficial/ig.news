import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getPrismicClient } from "../../services/prismic";
import { formatPostsProperties, Post as PostProperties } from "../../utils/formatPostsProperties";

import styles from "./styles.module.scss";

interface Post extends PostProperties {
    excerpt: string;
    title: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | ig.news</title>
            </Head>

            <main className={styles.container}>

                <section className={styles.wrapper}>
                
                    <ul className={styles.list}>

                        {posts.map(post => (
                            <li key={post.uid} className={styles.item}>
                                <Link href={`/posts/${post.uid}`}>
                                    <a href={post.uid} className={styles.anchor}>
                                        <div className={styles.flags}>
                                            <span className={styles.created}>{post.first_publication_date}</span>
                                        </div>
                                        <h1 className={styles.title}>{post.title}</h1>
                                        <p className={styles.description}>{post.excerpt}</p>
                                    </a>
                                </Link>
                            </li>
                        ))}

                    </ul>

                </section>

            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
    const client = getPrismicClient({ previewData })
    const posts = await client.getAllByType<any>("posts");
    const postsFormatted = formatPostsProperties(posts, { isPreview: false });
    return {
        props: {
            posts: postsFormatted
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}