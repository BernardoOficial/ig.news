import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from "./styles.module.scss";

interface ActiveLinkParams {
    label: string;
    href: string;
    hasPrefetch: boolean;
}

export function ActiveLink({ label, href, hasPrefetch }: ActiveLinkParams) {
    const router = useRouter();
    const path = router.route;

    return (
        <li className={`${styles["active-link"]} ${path === href ? styles["active-link--active"] : ""} `}>
            <Link href={href} prefetch={hasPrefetch ? true : false}>
                <a className={styles.link}>{label}</a>
            </Link>
        </li>
    );
}