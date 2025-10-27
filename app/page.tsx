"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Pencil } from "lucide-react";

interface Company {
  _id: string;
  name: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    const res = await fetch("/api/companies");
    setCompanies(await res.json());
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const createCompany = async () => {
    if (!name.trim()) return alert("Enter a name");
    setLoading(true);
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      fetchCompanies();
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#0B0B0F] via-[#111122] to-[#1B1B2E] text-white px-4 py-10">
      {/* ---------- Hero + Create Section ---------- */}
      <main className="flex flex-col items-center justify-center flex-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
            Smart Attendance System
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Manage and track attendance effortlessly — create your company and start recording attendance in seconds.
          </p>
        </motion.div>

        {/* Create Company Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-3 w-full max-w-lg"
        >
          <input
            className="flex-1 bg-transparent border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter company name (e.g. Accenture)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={createCompany}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </motion.div>

        {/* Company List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid gap-4 w-full max-w-lg"
        >
          {companies.length === 0 ? (
            <p className="text-gray-400">No companies yet. Create one above 👆</p>
          ) : (
            companies.map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/20 transition-all"
              >
                <a
                  href={`/${encodeURIComponent(c.name)}`}
                  className="text-xl font-semibold hover:font-bold"
                >
                  {c.name}
                </a>
                <button
                  onClick={() => alert(`Edit ${c.name}`)}
                  className="p-2 hover:text-blue-400 transition"
                >
                  <Pencil size={18} />
                </button>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
        <p className="text-center sm:text-left">
          Created by{" "}
          <span className="text-white font-semibold">@Shyam Kumar</span>
        </p>
        <div className="flex gap-4">
          <a
            href="https://linkedin.com/in/shyam2402"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
          <a
            href="https://github.com/shyam242"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-purple-400 transition"
          >
            <Github size={18} /> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
