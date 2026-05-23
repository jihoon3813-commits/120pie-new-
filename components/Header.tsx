"use client";

import { useEffect, useState } from "react";

const navItems = [
  ["왜 120pie인가", "#problems"],
  ["수익성", "#profit-calculator"],
  ["메뉴", "#menu"],
  ["성공사례", "#proof"],
  ["박람회", "#expo"],
  ["상담신청", "#consultation"]
];

function scrollToTarget(target: string) {
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target: string) => {
    scrollToTarget(target);
    setOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner">
        <button className="logo-button" onClick={() => go("#hero")} aria-label="맨 위로 이동">
          120pie<span>&coffee</span>
        </button>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map(([label, href]) => (
            <button key={href} onClick={() => go(href)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="cta small" onClick={() => go("#consultation")}>
            무료 상담 신청
          </button>
          <button
            className="hamburger"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open ? (
        <div className="mobile-nav">
          {navItems.map(([label, href]) => (
            <button key={href} onClick={() => go(href)}>
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
