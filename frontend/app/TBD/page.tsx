"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
      {/* Top Nav Bar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full px-4 py-4 flex items-center justify-center"
      >
        <nav className="glass-card rounded-2xl px-8 py-3 flex items-center justify-between max-w-2xl w-full">
          <Link href="/" className="flex items-center space-x-3">
            <Home className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Home
            </span>
          </Link>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About
          </span>
        </nav>
      </motion.header>

      {/* About Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="glass-card max-w-2xl w-full rounded-2xl p-8 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About This Project
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            This is a modern professional networking platform example built with Next.js, Tailwind CSS, Framer Motion, and glassmorphism UI.
            <br />
            <span className="block mt-4 text-base text-gray-400">
              The About page demonstrates a <span className="text-blue-400">production-ready</span> page structure, clean animations, and a consistent premium theme.
            </span>
          </p>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            <ul className="text-left mx-auto text-base text-gray-200 list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold text-purple-400">Production-first styling:</span> Glass/gradient theme via CSS.
              </li>
              <li>
                <span className="font-semibold text-purple-400">Animation:</span> Smooth transitions with Framer Motion.
              </li>
              <li>
                <span className="font-semibold text-purple-400">Accessible and minimal navigation.</span>
              </li>
              <li>
                <span className="font-semibold text-purple-400">Ready for real deployment</span>—just add your content!
              </li>
            </ul>

            <Link
              href="/"
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:scale-105 transition-transform shadow-md text-white"
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.section>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="mt-12 mb-8 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-5 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TBD In Production 
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
