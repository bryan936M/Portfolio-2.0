"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";

const links = [
  ["Work", "/work/"],
  ["Lab", "/lab/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="site-header">
      <Link
        className="identity"
        href="/"
        onClick={() => setOpen(false)}
        aria-label="Bryan Murasira — home"
      >
        <BrandMark className="identity-mark" />
        <span className="identity-name">Bryan Murasira</span>
      </Link>
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        id="main-navigation"
        className={open ? "main-navigation is-open" : "main-navigation"}
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              path.startsWith(href.slice(0, -1)) ? "page" : undefined
            }
            onClick={() => setOpen(false)}
          >
            {label}
            <span className="nav-dot" aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </header>
  );
}
