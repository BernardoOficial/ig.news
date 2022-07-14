import Image from "next/image";
import Head from "../../node_modules/next/head";
import { GetStaticProps } from "next";

import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe-back";

import styles from "../styles/home.module.scss";
import { formatNumber } from "../utils/formatNumber";

interface Product {
  priceId: string;
  amount: number;
}

interface HomeProps {
  product: Product;
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>

      <main className={styles.container}>

        <section className={styles.wrapper}>
          
          <div className={styles.content}>
            <div className={styles.welcome}>
              <figure className={styles["container-emoji"]}>
                <Image className={styles.logo} src="/assets/images/aplausos.svg" alt="Hello!" width="26" height="26" />
              </figure>
              <span className={styles.label}>Hey, welcome</span>
            </div>
            <h1 className={styles.title}>News about the <span>React</span> world</h1>
            <h2 className={styles.subtitle}>Get acess to all the publications for <span>{product.amount} month</span></h2>

            <SubscribeButton priceId={product.priceId} />
          </div>

          <div className={styles.avatar}>
            <figure className={styles["container-image"]}>
              <Image className={styles.logo} src="/assets/images/avatar.svg" alt="React world" width="336" height="521" />
            </figure>
          </div>

        </section>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const priceIdAPI = "price_1LIJnmCFI8EvYmjWYwf8Y3Tm";
  const price = await stripe.prices.retrieve(priceIdAPI, { expand: ["product"] });

  const product = {
    priceId: price.id,
    amount: formatNumber(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}