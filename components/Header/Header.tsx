'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import css from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" aria-label="Home page">
          <Logo />
        </Link>
        
        <nav className={css.nav}>
          <Link 
            href="/" 
            className={`${css.navLink} ${pathname === '/' ? css.active : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/catalog" 
            className={`${css.navLink} ${pathname === '/catalog' ? css.active : ''}`}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}