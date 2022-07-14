import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import { formatPostsProperties, Post as PostProperties } from "../../../utils/formatPostsProperties";

import styles from "../post.module.scss";

interface Post extends PostProperties {
    excerpt: string;
    title: string;
    titleHTML: string;
    contentHTML: string;
}

interface PostPreviewProps {
    post: Post;
    subscriptionStatus: string;
}

export default function PostPreview({ post }: PostPreviewProps) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session?.activeSubscription) {
            router.push(`/posts/${post.uid}`);
        }
    }, [post.uid, router, session]);

    function createMarkupContent() {
        return { __html: post.contentHTML }
    }

    return (
        <>
            <Head>
                <title>{post.title} | ig.news</title>
            </Head>

            <main className={styles.container}>

                <section className={styles.wrapper}>

                    <section className={styles.header}>
                        <h1>{post.title}</h1>
                    </section>

                    <section className={styles.archor}>
                        <span className={styles.created}>12 de março de 2021</span>
                    </section>

                    <section className={`${styles.content} ${styles.preview}`} dangerouslySetInnerHTML={createMarkupContent()} />

                    <div className={styles["continue-reading"]}>
                        <button className={styles.button}>
                            Wanna continue reading? 
                            <Link href="/">
                                <a>Subscribe now</a>
                            </Link>

                        </button>
                    </div>

                </section>

            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({ params, previewData }) => {
    const { uid } = params;
    const client = getPrismicClient({ previewData });
    const post = await client.getByUID<any>("posts", String(uid));
    const postFormatted = formatPostsProperties([post], { isPreview: true });
    return {
        props: {
            post: postFormatted[0]
        },
        revalidate: 60 * 30 // 30min
    }
}