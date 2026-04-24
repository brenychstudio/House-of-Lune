"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

const EXIT_DELAY_MS = 220;
const SAFETY_RESET_MS = 1600;
const TRANSITION_KEY = "hol-route-transition";

type TransitionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
};

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function getHrefPathname(href: string) {
  try {
    return new URL(href, "http://local").pathname;
  } catch {
    return href.split("?")[0]?.split("#")[0] ?? href;
  }
}

export function TransitionLink({
  href,
  children,
  onClick,
  onMouseEnter,
  replace = false,
  scroll = true,
  target,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleMouseEnter(event: MouseEvent<HTMLAnchorElement>) {
    onMouseEnter?.(event);

    if (!event.defaultPrevented && href.startsWith("/")) {
      router.prefetch(href);
    }
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const hrefPathname = getHrefPathname(href);
    const isSamePath = hrefPathname === pathname;

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      target === "_blank" ||
      href.startsWith("#") ||
      isExternalHref(href) ||
      isSamePath
    ) {
      return;
    }

    event.preventDefault();

    const root = document.documentElement;

    window.sessionStorage.setItem(TRANSITION_KEY, "1");
    root.classList.remove("route-entering");
    root.classList.add("route-transitioning", "route-leaving");

    window.setTimeout(() => {
      if (replace) {
        router.replace(href, { scroll });
      } else {
        router.push(href, { scroll });
      }
    }, EXIT_DELAY_MS);

    window.setTimeout(() => {
      root.classList.remove("route-transitioning", "route-leaving", "route-entering");
      window.sessionStorage.removeItem(TRANSITION_KEY);
    }, SAFETY_RESET_MS);
  }

  return (
    <Link
      href={href}
      target={target}
      scroll={scroll}
      replace={replace}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
