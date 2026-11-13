"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

let pendingPath: string | undefined;

function normalizePath(path: string) {
  return path.replace(/\/$/, "") || "/";
}

export function clearPageTopRequest() {
  pendingPath = undefined;
}

export function consumePageTopRequest(path: string) {
  const shouldReset = pendingPath === normalizePath(path);
  clearPageTopRequest();
  return shouldReset;
}

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function SiteLink({ href, scroll, onNavigate, ...props }: SiteLinkProps) {
  const opensAtTop = href.startsWith("/") && !href.startsWith("//") && !href.includes("#") && scroll !== false;
  return (
    <Link
      {...props}
      href={href}
      scroll={opensAtTop ? false : scroll}
      onNavigate={(event) => {
        let prevented = false;
        onNavigate?.({
          preventDefault() {
            prevented = true;
            event.preventDefault();
          },
        });
        if (prevented) return;
        clearPageTopRequest();
        if (!opensAtTop) return;
        const destination = normalizePath(new URL(href, location.href).pathname);
        if (destination === normalizePath(location.pathname)) return;
        const state = history.state;
        if (location.pathname === "/" && state?.ribbonOpenPanels?.length) {
          history.replaceState({ ...state, ribbonReadingScroll: window.scrollY }, "");
        }
        pendingPath = destination;
      }}
    />
  );
}
