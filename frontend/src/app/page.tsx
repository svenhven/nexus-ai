"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/analyze/${encodeURIComponent(input)}`);
      setResult(res.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to analyze text" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center mb-10"
      >
      <motion.img
        src="/logo.svg"
        alt="Nexus AI Logo"
        className="w-12 h-12 mr-4"
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
        />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Nexus AI</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && analyze()}
          className="w-full p-3 mb-4 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Ketik sesuatu untuk dianalisis..."
        />
        <button
          onClick={analyze}
          disabled={loading}
          className={`w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-semibold transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Menganalisis..." : "Analisis"}
        </button>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-900/70 rounded-lg"
          >
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <p className="text-sm text-gray-300">Teks: <span className="text-white">{result.text}</span></p>
                <p className="text-sm text-gray-300">
                  Sentimen: <span className="font-semibold">{result.sentiment.label}</span> (Score: {result.sentiment.score.toFixed(2)})
                </p>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 text-gray-400 text-sm"
      >
        © 2025 Nexus AI - Powered by SvenHven
      </motion.p>
    </div>
  );
}