import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';

import styles from "./styles.module.scss";

export function Header() {
    return (
        <header className={styles.container}>

            <div className={styles.wrapper}>
                
                <nav className={styles.navbar}>
                    <figure className={styles["container-logo"]}>
                        <Link href="/">
                            <Image src="/assets/images/logo.svg" alt="ig.news" width="108" height="30" />
                        </Link>
                    </figure>

                    <div className={styles["container-menu"]}>
                        <ul className={styles.list}>
                            <ActiveLink label="Home" href="/" hasPrefetch={false} />
                            <ActiveLink label="Posts" href="/posts" hasPrefetch={true} />
                        </ul>
                    </div>
                </nav>

                <SignInButton />

            </div>

        </header>
    );
}