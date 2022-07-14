import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe-back";

type User = {
    ref: { id: string; }
    data: { stripe_customer_id: string; }
}

const checkout = async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === "POST") {
        const session = await getSession({ ctx: { req: request } });
        const priceIdAPI = "price_1LIJnmCFI8EvYmjWYwf8Y3Tm";

        const user = await fauna.query<User>(
            q.Get(
                q.Match(q.Index("user_by_email"), q.Casefold(session.user.email))
            )
        )

        let stripeCustomerId = user.data.stripe_customer_id;

        if(!stripeCustomerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            });
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    { data: { stripe_customer_id: stripeCustomer.id } }
                )
            );
            stripeCustomerId = stripeCustomer.id;
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            allow_promotion_codes: true,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            line_items: [
              { price: priceIdAPI, quantity: 1 },
            ],
        });
        return response.status(200).json({ sessionId: checkoutSession.id });
    }
    else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not allowed");
    }
}

export default checkout;