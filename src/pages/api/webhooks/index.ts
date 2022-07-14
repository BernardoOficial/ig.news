import Stripe from "stripe";
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "../../../services/stripe-back";
import { saveSubscription, updateSubscription } from "../_helpers/manageSubscription";

async function buffer(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
])

const webhooks = async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === "POST") {
        const buf = await buffer(request);
        const secret = request.headers["stripe-signature"];
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET_KEY);
        } catch (error) {
            return response.status(400).send("Webhook error: " + error.message);
        }

        const { type } = event;

        console.log("webhook type event: " + type)

        if(relevantEvents.has(type)) {
            try {
                switch(type) {
                    case "customer.subscription.updated":
                    case "customer.subscription.deleted":
                        const subscription = event.data.object as Stripe.Subscription; 
                        await updateSubscription(
                            subscription.id,
                            subscription.customer.toString()
                        )
                        break;
                    case "checkout.session.completed":
                        const checkoutSession = event.data.object as Stripe.Checkout.Session; 
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString()
                        );
                        break;
                    default:
                        throw new Error("unhandled event");
                }
            } catch (error) {
                console.log("Error: ", error.message);
                return response.json({ error: error.message })
            }
        }
        return response.json({ received: true });
    }
    return response.json({ ok: true });
}

export default webhooks;