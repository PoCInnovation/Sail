"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FooterLinkGroupProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h4
        className="text-white font-bold mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h4>
      <ul
        className="space-y-4 text-sm"
        style={{ fontFamily: "var(--font-tech)" }}
      >
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover:text-cyan transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({
  icon,
  href,
  label,
}: {
  icon: string;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan hover:text-black transition-colors"
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
    </a>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-cyan transition-colors placeholder-gray-600"
          placeholder="Enter email..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-cyan text-black font-bold py-2 rounded-lg text-sm hover:shadow-neon-sm transition-shadow"
      >
        JOIN NEWSLETTER
      </button>
    </form>
  );
}

export function NewLandingFooter() {
  const protocolLinks = [
    { label: "Governance", href: "#" },
    { label: "Developers", href: "#" },
    { label: "Security Audit", href: "#" },
    { label: "Bug Bounty", href: "#" },
  ];

  const resourceLinks = [
    { label: "Documentation", href: "#docs" },
    { label: "Media Kit", href: "#" },
    { label: "Whitepaper", href: "#" },
    { label: "Community", href: "#" },
  ];

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5 text-slate-400 flex justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo-simple.png"
                  alt="Sail Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className="font-bold text-3xl text-white tracking-tighter"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SAIL
              </span>
            </Link>
            <p
              className="max-w-xs text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-tech)" }}
            >
              The premiere no-code DeFi strategy builder. Navigate the
              blockchain with precision tools and deep liquidity access.
            </p>
            <div className="flex gap-4">
              <SocialButton icon="public" href="#" label="Website" />
              <SocialButton icon="code" href="#" label="GitHub" />
              <SocialButton icon="forum" href="#" label="Discord" />
            </div>
          </motion.div>

          {/* Protocol links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FooterLinkGroup title="Protocol" links={protocolLinks} />
          </motion.div>

          {/* Resource links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FooterLinkGroup title="Resources" links={resourceLinks} />
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4
              className="text-white font-bold mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Subscribe
            </h4>
            <NewsletterForm />
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono">
            © 2024 SAIL Foundation. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-mono">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
