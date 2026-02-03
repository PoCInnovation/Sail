"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagVariant: "cyan" | "indigo" | "pink";
  imageUrl: string;
}

interface ArticleCardProps extends NewsArticle {
  index: number;
}

function ArticleCard({
  title,
  description,
  tag,
  tagVariant,
  imageUrl,
  index,
}: ArticleCardProps) {
  const tagClasses = {
    cyan: "bg-cyan/20 border-cyan/40 text-cyan",
    indigo: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
    pink: "bg-pink-500/20 border-pink-500/40 text-pink-300",
  };

  return (
    <motion.article
      className="glass-panel group rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="h-48 bg-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0 mix-blend-overlay"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span
            className={`px-2 py-1 border text-[10px] font-bold rounded uppercase tracking-wider ${tagClasses[tagVariant]}`}
          >
            {tag}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="font-bold text-xl text-white mb-2 group-hover:text-cyan transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "var(--font-tech)" }}
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}

export function NewsSection() {
  const articles: NewsArticle[] = [
    {
      id: "1",
      title: "Ecosystem RFP Program Launch",
      description:
        "Funding the next wave of modular strategy builders on the network.",
      tag: "Update v2.1",
      tagVariant: "cyan",
      imageUrl: "/images/news-1.jpg",
    },
    {
      id: "2",
      title: "Standard Crypto leads $140M round",
      description:
        "Accelerating the development of high-speed storage networks.",
      tag: "Capital",
      tagVariant: "indigo",
      imageUrl: "/images/news-2.jpg",
    },
    {
      id: "3",
      title: "Talus AI Agents Integration",
      description:
        "Powering autonomous trading agents with verifiable on-chain data.",
      tag: "Integration",
      tagVariant: "pink",
      imageUrl: "/images/news-3.jpg",
    },
  ];

  return (
    <section className="py-24 bg-midnight relative flex justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <motion.h2
            className="font-bold text-4xl text-white tracking-tight uppercase"
            style={{ fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Missions & Transmissions
          </motion.h2>
          <Link
            href="#"
            className="text-cyan font-mono text-sm hover:underline tracking-widest uppercase flex items-center gap-2"
          >
            View All Logs
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} {...article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
