import { signIn, signOut, useSession } from "next-auth/react"
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { formatLimitCaracters } from "../../utils/formatLimitCaracters";
import styles from "./styles.module.scss";

export function SignInButton() {
    const { data: session } = useSession();
    console.log(session);

    return session ? (
        <button 
            className={styles['button-logout']}
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361" className={styles.icon} size="24" title="Github" />
            <span className={styles.label}>{formatLimitCaracters(session.user.name, 15, true)}</span>
            <FiX color="#737380" className={styles.close} size="20" title="log out of account" />
        </button>
    ) : (
        <button 
            className={styles['button-logged']}
            onClick={() => signIn("github")}
        >
            <FaGithub color="#eba417" className={styles.icon} size="24" title="Github" />
            <span className={styles.label}>Sign in with Github</span>
        </button>
    )
}