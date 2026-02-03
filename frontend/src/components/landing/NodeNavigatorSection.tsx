"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  variant: "cyan" | "indigo" | "pink";
}

function FeatureCard({ icon, title, description, variant }: FeatureCardProps) {
  const colorClasses = {
    cyan: "bg-cyan/10 text-cyan shadow-neon-sm",
    indigo: "bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_#6366f1]",
    pink: "bg-pink-500/10 text-pink-400 shadow-[0_0_10px_#f472b6]",
  };

  return (
    <div className="glass-panel p-6 rounded-lg flex items-center gap-4 group hover:bg-cyan/5 transition-colors">
      <div
        className={`p-3 rounded-full group-hover:scale-110 transition-transform ${colorClasses[variant]}`}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3
          className="font-bold text-white text-xl"
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
    </div>
  );
}

function NodeVisualization() {
  return (
    <div className="relative h-[500px] w-full glass-panel rounded-2xl border border-cyan/30 flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0%, #00f0ff 2%, transparent 2%), linear-gradient(90deg, transparent 0%, #00f0ff 2%, transparent 2%)",
        }}
      />

      <div className="relative z-10 w-full h-full p-10">
        {/* Input Token Node */}
        <motion.div
          className="absolute top-10 left-10 p-4 glass-panel rounded-lg border-l-4 border-cyan w-48 animate-float"
          style={{ animationDuration: "4s" }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-cyan">INPUT_TOKEN</span>
            <div className="w-2 h-2 rounded-full bg-cyan shadow-neon-sm" />
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-cyan w-3/4" />
          </div>
        </motion.div>

        {/* Central Processing Node */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 glass-panel rounded-full border border-white/20 w-32 h-32 flex items-center justify-center shadow-orb z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="material-symbols-outlined text-4xl text-white animate-pulse">
            settings_suggest
          </span>
        </motion.div>

        {/* Connection lines */}
        <div className="absolute top-1/3 left-1/4 w-32 h-[1px] bg-gradient-to-r from-cyan to-transparent rotate-45 transform origin-left" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-[1px] bg-gradient-to-l from-indigo-500 to-transparent -rotate-12 transform origin-right" />

        {/* Output Yield Node */}
        <motion.div
          className="absolute bottom-20 right-20 p-4 glass-panel rounded-lg border-l-4 border-indigo-500 w-48 animate-float"
          style={{ animationDuration: "5s" }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-indigo-400">
              YIELD_OUTPUT
            </span>
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]" />
          </div>
          <div
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            + 12.4%
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BackgroundNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <line
            x1="400"
            y1="300"
            x2="200"
            y2="150"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="600"
            y2="150"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="200"
            y2="450"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="300"
            x2="600"
            y2="450"
            stroke="#00f0ff"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="300"
            r="10"
            fill="#00f0ff"
            className="animate-pulse"
          />
          <circle cx="200" cy="150" r="5" fill="#4f46e5" />
          <circle cx="600" cy="150" r="5" fill="#4f46e5" />
          <circle cx="200" cy="450" r="5" fill="#4f46e5" />
          <circle cx="600" cy="450" r="5" fill="#4f46e5" />
        </svg>
      </div>
    </div>
  );
}

export function NodeNavigatorSection() {
  const features: FeatureCardProps[] = [
    {
      icon: "hub",
      title: "Visual Logic",
      description: "No code required. Connect the dots.",
      variant: "cyan",
    },
    {
      icon: "security",
      title: "Verified Modules",
      description: "Audited nodes for secure execution.",
      variant: "indigo",
    },
    {
      icon: "bolt",
      title: "Flash Execution",
      description: "Milliseconds latency on Sui.",
      variant: "pink",
    },
  ];

  return (
    <section
      id="builder"
      className="py-32 bg-midnight relative overflow-hidden flex justify-center"
    >
      <BackgroundNetwork />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-bold text-5xl md:text-6xl text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              NODE <span className="text-cyan text-glow">NAVIGATOR</span>
            </h2>
            <p
              className="text-cyan-100/60 text-lg mb-10"
              style={{ fontFamily: "var(--font-tech)" }}
            >
              Compose your strategy through an interactive web of crystalline
              connections. Drag, drop, and link logic nodes to execute complex
              financial maneuvers in the deep sea of DeFi.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </motion.div>

          {/* Right visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <NodeVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
