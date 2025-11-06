"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

interface Attendance {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  photo: string;
  ip_address: string;
  createdAt: string;
}

export default function CompanyClientPage({ company }: { company: string }) {
  const decodedCompany = company;
  const [companyURL, setCompanyURL] = useState("");

  // ✅ FIX: Generate URL only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCompanyURL(`${window.location.origin}/${encodeURIComponent(decodedCompany)}`);
    }
  }, [decodedCompany]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    branch: "",
    photo: "",
  });

  const updateField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

    setForm((prev) => ({
      ...prev,
      photo: canvas.toDataURL("image/jpeg"),
    }));
  };

  const handleSubmit = async () => {
    const { name, email, rollNumber, branch, photo } = form;

    if (!name || !email || !rollNumber || !branch || !photo) {
      return alert("Please fill all fields and capture a photo.");
    }

    setLoading(true);

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        company: decodedCompany,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setForm({
        name: "",
        email: "",
        rollNumber: "",
        branch: "",
        photo: "",
      });
      fetchAttendees();
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen") as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${decodedCompany}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#111122] to-[#1B1B2E] text-white flex flex-col items-center px-4 py-10">
      
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 text-transparent bg-clip-text"
      >
        {decodedCompany} — Attendance
      </motion.h1>

      {/* ✅ FLEX LAYOUT: FORM LEFT, QR RIGHT */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl mb-10">

        {/* ✅ LEFT: Attendance Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 w-full lg:w-2/3"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Mark Your Attendance</h2>

          <div className="flex flex-col gap-3">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="bg-transparent border border-white/20 px-4 py-3 rounded-xl"
            />

            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="bg-transparent border border-white/20 px-4 py-3 rounded-xl"
            />

            <input
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={(e) => updateField("rollNumber", e.target.value)}
              className="bg-transparent border border-white/20 px-4 py-3 rounded-xl"
            />

            <input
              placeholder="Branch"
              value={form.branch}
              onChange={(e) => updateField("branch", e.target.value)}
              className="bg-transparent border border-white/20 px-4 py-3 rounded-xl"
            />

            <button
              onClick={handlePhotoCapture}
              className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold"
            >
              Capture Photo
            </button>

            {form.photo && (
              <img
                src={form.photo}
                className="w-32 h-32 mx-auto rounded-xl object-cover border border-white/20"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 hover:bg-purple-500 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </motion.div>

        {/* ✅ RIGHT: QR Code Panel */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center w-full lg:w-1/3">

          {companyURL ? (
            <QRCodeCanvas id="qr-gen" value={companyURL} size={220} />
          ) : (
            <div className="w-[220px] h-[220px] bg-gray-700 animate-pulse rounded-xl" />
          )}
          <button
            onClick={downloadQR}
            className="mt-4 bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold"
          >
            Download QR
          </button>
        </div>
      </div>

      {/* ✅ Attendees List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 p-6 rounded-2xl w-full max-w-4xl border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4">All Attendees</h2>

        {attendees.length === 0 ? (
          <p className="text-gray-400">No attendance yet.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {attendees.map((a) => (
              <div
                key={a._id}
                className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-gray-300">{a.email}</p>
                  <p className="text-gray-400">{a.rollNumber} — {a.branch}</p>
                  <p className="text-gray-500 text-xs">
                    {a.ip_address} — {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                {a.photo && (
                  <img
                    src={a.photo}
                    className="w-14 h-14 rounded-lg object-cover border border-white/20"
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
