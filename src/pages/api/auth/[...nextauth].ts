import { query as q } from "faunadb"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from "../../../services/fauna"

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user,user:email'
                }
            }
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    callbacks: {

        async session({ session }) {
            const userEmail = session.user.email;
            try {
                const queryMatchSubscriptionByUserId = q.Match(
                    q.Index("subscription_by_userId"),
                    q.Select(
                        "ref",
                        q.Get(
                            q.Match(
                                q.Index("user_by_email"), 
                                q.Casefold(userEmail)
                            )
                        )
                    ),
                );
                const queryMatchSubscriptionByStatus = q.Match(
                    q.Index("subscription_by_status"),
                    "active"
                )
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            queryMatchSubscriptionByUserId,
                            queryMatchSubscriptionByStatus
                        ])
                    )
                );
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }

            } catch (error) {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },

        async signIn({ user }) {
            const { email, name } = user;
            try {
                const queryIndexUserByEmail = q.Match(q.Index("user_by_email"), q.Casefold(email));
                const queryGetGetUser = q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)));
                const queryCreateNewUser = q.Create(q.Collection('users'), { data: { email, name } });
                const query = q.If(q.Not(q.Exists(queryIndexUserByEmail)), queryCreateNewUser, queryGetGetUser);
                const response = await fauna.query(query);
                return true;
            } catch (error) {
                console.log("Erro SignIn: ", error.message);
                return false;
            }
        },
    }
})