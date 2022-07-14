import { formatDate } from "./formatDate";
import * as prismicH from "@prismicio/helpers";

export interface Spans {
    start: number;
    end: number;
    type: string | "em" | "strong" | "i" | "u" | "a";
}

export interface Content {
    type: string;
    text: string;
    spans: Spans[];
}

export interface Heading {
    type: string;
    text: string;
    spans: string[];
}

export interface PostContent {
    title: Heading[];
    content: Content[];
}

export interface Post {
    id: string;
    uid: string;
    type: string;
    first_publication_date: string;
    last_publication_date: string;
    slugs: string[];
    linked_documents: [],
    data: PostContent;
}

export function formatPostsProperties(posts: any[], { isPreview = false }) {
    return posts.map(post => ({
        id: post.id,
        uid: post.uid,
        type: post.type,
        first_publication_date: formatDate(post.first_publication_date),
        last_publication_date: formatDate(post.last_publication_date),
        slugs: post.slugs,
        data: post.data,
        titleHTML: prismicH.asHTML(post.data.title),
        contentHTML: isPreview ? prismicH.asHTML(post.data.content.slice(0, 3)) : prismicH.asHTML(post.data.content),
        title: post.data.title.find((title: Heading) => title.type.includes("heading"))?.text ?? "",
        excerpt: post.data.content.find((content: Content) => content.type === "paragraph")?.text ?? "",
    }));
}