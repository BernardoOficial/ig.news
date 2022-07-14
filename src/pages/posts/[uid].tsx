import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getPrismicClient } from "../../services/prismic";
import { formatPostsProperties, Post as PostProperties } from "../../utils/formatPostsProperties";

import styles from "./post.module.scss";

interface Post extends PostProperties {
    excerpt: string;
    title: string;
    titleHTML: string;
    contentHTML: string;
}

interface PostProps {
    post: Post;
    subscriptionStatus: string;
}

export default function Post({ post }: PostProps) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(!session?.activeSubscription) {
            router.push(`/posts/preview/${post.uid}`);
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

                    <section className={styles.content} dangerouslySetInnerHTML={createMarkupContent()} />

                </section>

            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params, previewData }) => {
    const { uid } = params;
    const client = getPrismicClient({ previewData });
    const post = await client.getByUID<any>("posts", String(uid));
    const postFormatted = formatPostsProperties([post], { isPreview: false });
    return {
        props: {
            post: postFormatted[0]
        },
    }
}