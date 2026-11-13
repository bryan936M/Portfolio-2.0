"use client";

import { SiteLink } from "@/components/layout/SiteLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteLinks } from "@/components/layout/navigation";
import { BrandMark } from "@/components/ui/BrandMark";

export function Header() {
  const path = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === path;
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const mobile = matchMedia("(max-width: 640px)");
    const panel = navigation.current;
    const page = document.querySelectorAll<HTMLElement>(".skip-link, #main, .site-footer");
    const sync = () => {
      if (panel) panel.inert = mobile.matches && !open;
      page.forEach(element => { element.inert = mobile.matches && open; });
    };
    sync();
    mobile.addEventListener("change", sync);
    return () => {
      mobile.removeEventListener("change", sync);
      if (panel) panel.inert = false;
      page.forEach(element => { element.inert = false; });
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpenPath(null);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="site-header">
      <SiteLink
        className="identity"
        href="/"
        onClick={() => setOpenPath(null)}
        aria-label="Bryan Murasira — home"
      >
        <BrandMark className="identity-mark" />
        <span className="identity-name">Bryan Murasira</span>
      </SiteLink>
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenPath(open ? null : path)}
      >
        <span className="menu-lines" aria-hidden="true"><span /><span /><span /></span>
      </button>
      <nav
        ref={navigation}
        id="main-navigation"
        className={open ? "main-navigation is-open" : "main-navigation"}
        aria-label="Main navigation"
      >
        {([["Home", "/"], ...siteLinks] as const).map(([label, href]) => (
          <SiteLink
            key={href}
            href={href}
            className={href === "/" ? "mobile-home-link" : undefined}
            aria-current={
              (href === "/" ? path === "/" : path === href.slice(0, -1) || path.startsWith(href)) ? "page" : undefined
            }
            onClick={() => setOpenPath(null)}
          >
            {label}
            <span className="nav-dot" aria-hidden="true" />
          </SiteLink>
        ))}
      </nav>
    </header>
  );
}
