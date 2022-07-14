import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { NextRequest } from 'next/server';

interface createClientConfig {
    previewData?: {};
    request?: NextRequest;
}

export const repositoryEndpoint = prismic.getRepositoryEndpoint("ignews-dev-2022");

export function getPrismicClient(config: createClientConfig = {}) {
    const client = prismic.createClient(repositoryEndpoint, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN
    });
    enableAutoPreviews({
        client,
        previewData: config.previewData,
        req: config.request,
    });
    return client;
}