import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/favicon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon.png" />
                    <link rel="mask-icon" href="/assets/favicon/favicon.png" color="#61DAFB" />
                    <meta name="msapplication-TileColor" content="#61DAFB" />
                    <meta name="theme-color" content="#121214" />

                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}