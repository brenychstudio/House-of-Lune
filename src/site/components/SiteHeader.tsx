"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { SiteContent } from "@/site/content";

type SiteHeaderProps = Readonly<{
  content: SiteContent;
}>;

const focusableSelector = "a[href], button:not([disabled])";

export function SiteHeader({ content }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    triggerRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusable = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );

    document.body.style.overflow = "hidden";
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link
          href={`/${content.locale}`}
          className="wordmark"
          aria-label={`${content.identity.name} home`}
        >
          {content.identity.name}
        </Link>

        <nav aria-label="Primary navigation" className="site-header__desktop-nav">
          {content.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          ref={triggerRef}
          type="button"
          className="menu-trigger"
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          aria-label={isMenuOpen ? "Close menu" : "Menu"}
          onClick={() => {
            if (isMenuOpen) {
              closeMenu();
            } else {
              setIsMenuOpen(true);
            }
          }}
        >
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {isMenuOpen ? (
        <div id="site-menu" className="site-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <nav ref={menuRef} aria-label="Menu navigation" className="site-menu__nav">
            {content.navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                <span>{item.label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
          <p className="site-menu__locale">English · Development shell locale</p>
        </div>
      ) : null}
    </header>
  );
}
