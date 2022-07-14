import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { axi } from '../../services/axios';
import { getStripeJs } from '../../services/stripe-front';
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if(!session) {
            await signIn("github");
            return;
        }

        if(session.activeSubscription) {
            router.push("/posts");
            return;
        }

        try {
            const response = await axi.post("/api/subscribe");
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <button
            className={styles.button}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}