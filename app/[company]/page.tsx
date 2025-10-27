"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Attendance {
  _id: string;
  name: string;
  email: string;
  photo: string;
  ip_address: string;
  createdAt: string;
}

export default function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = use(params);
  const decodedCompany = decodeURIComponent(company);

  const [form, setForm] = useState({ name: "", email: "", photo: "" });
  const [attendees, setAttendees] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendees = async () => {
    const res = await fetch(`/api/attendance?company=${decodedCompany}`);
    setAttendees(await res.json());
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const handlePhotoCapture = async () => {
    const video = document.createElement("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach((t) => t.stop());

    setForm({ ...form, photo: canvas.toDataURL("image/jpeg") });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Please fill in all fields");

    setLoading(true);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company: decodedCompany }),
    });
    setLoading(false);

    if (res.ok) {
      setForm({ name: "", email: "", photo: "" });
      fetchAttendees();
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  // 🧾 Download CSV
  const downloadCSV = () => {
    const header = ["Name", "Email", "IP Address", "Timestamp"];
    const rows = attendees.map((a) => [
      a.name,
      a.email,
      a.ip_address,
      new Date(a.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${decodedCompany}_attendance.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#111122] to-[#1B1B2E] text-white flex flex-col items-center px-4 py-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 text-transparent bg-clip-text"
      >
        {decodedCompany} Attendance
      </motion.h1>

      {/* Attendance Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 w-full max-w-xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Mark Your Attendance</h2>
        <div className="flex flex-col gap-3">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent border border-white/20 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-transparent border border-white/20 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handlePhotoCapture}
            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Capture Photo
          </button>

          {form.photo && (
            <img
              src={form.photo}
              alt="Captured"
              className="w-32 h-32 object-cover rounded-xl border border-white/20 mx-auto"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </motion.div>

      {/* Attendees List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 w-full max-w-3xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Attendees</h2>
          <button
            onClick={downloadCSV}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-4 py-2 rounded-xl font-semibold transition-all"
          >
            Download CSV
          </button>
        </div>

        {attendees.length === 0 ? (
          <p className="text-gray-400 text-center">No attendance records yet.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {attendees.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all"
              >
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-gray-400">{a.email}</p>
                  <p className="text-xs text-gray-500">
                    {a.ip_address} — {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                {a.photo && (
                  <img
                    src={a.photo}
                    alt="Photo"
                    className="w-14 h-14 rounded-lg object-cover border border-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
