import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe-back";
import Stripe from "stripe";

export async function createSubscription(
    subscriptionId: string,
    customerId: string
) {
    const [userRef, subscription] = await getInfoUserAndSubscription(subscriptionId, customerId);

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        priceId: subscription.items.data[0].price.id,
        signatureDate: subscription.created,
        status: subscription.status,
    }

    await fauna.query(
        q.Create(
            q.Collection('subscriptions'), 
            { data: subscriptionData }
        )
    )

}

export async function updateSubscription(
    subscriptionId: string,
    customerId: string
) {
    const [userRef, subscription] = await getInfoUserAndSubscription(subscriptionId, customerId);

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        priceId: subscription.items.data[0].price.id,
        signatureDate: subscription.created,
        status: subscription.status,
    }

    await fauna.query(
        q.Replace(
            q.Select(
                "ref",
                q.Get(
                    q.Match(q.Index("subscription_by_id"), subscription.id)
                )
            ),
            { data: subscriptionData }
        )
    )

}

async function getInfoUserAndSubscription(
    subscriptionId: string,
    customerId: string
): Promise<[object, Stripe.Response<Stripe.Subscription>]> {
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(q.Index("user_by_stripe_customer_id"), customerId)
            )
        )
    );
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return [userRef, subscription];
}


export async function saveSubscription(
    subscriptionId: string,
    customerId: string
) {

    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(q.Index("user_by_stripe_customer_id"), customerId)
            )
        )
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        priceId: subscription.items.data[0].price.id,
        signatureDate: subscription.created,
        status: subscription.status,
    }

    await fauna.query(
        q.Create(
            q.Collection('subscriptions'), 
            { data: subscriptionData }
        )
    )

}