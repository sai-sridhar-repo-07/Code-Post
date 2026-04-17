"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, ExternalLink, Save, Globe, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCardStore } from "@/lib/store";

async function captureCard(elementId: string): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Card element not found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (html2canvas as any)(element, {
    scale: 2,
    backgroundColor: null,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });
}

export function ExportPanel() {
  const { config } = useCardStore();
  const { data: session } = useSession();
  const [exporting, setExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const saveCard = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${session.user?.name ?? "My"}'s Card`,
          themeName: config.theme,
          customColors: config.customColors,
          enabledComponents: config.enabledComponents,
          layoutConfig: config.layout,
          isPublic,
          quote: config.quote,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const exportAs = async (format: "png" | "jpeg" | "pdf") => {
    setExporting(format);
    try {
      const canvas = await captureCard("card-canvas");

      if (format === "pdf") {
        const { default: jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: config.layout.width > config.layout.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width / 2, canvas.height / 2],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save("codepost-card.pdf");
      } else {
        const dataURL = canvas.toDataURL(`image/${format}`, 1.0);
        const link = document.createElement("a");
        link.download = `codepost-card.${format}`;
        link.href = dataURL;
        link.click();
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  const copyToClipboard = async () => {
    try {
      const canvas = await captureCard("card-canvas");
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      "Check out my developer card on CodePost! 🚀 #CodePost #GitHub #Developer"
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Save to Gallery */}
      {session && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Save Card
          </h3>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {isPublic ? <Globe size={12} className="text-green-400" /> : <Lock size={12} className="text-gray-500" />}
              <span>{isPublic ? "Public gallery" : "Private"}</span>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isPublic ? "bg-green-500/70" : "bg-white/15"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isPublic ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <motion.button
            onClick={saveCard}
            disabled={saving || saved}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-500/50 text-xs text-violet-300 hover:text-violet-200 transition-all disabled:opacity-60"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <Check size={13} className="text-green-400" />
            ) : (
              <Save size={13} />
            )}
            {saved ? "Saved to Gallery!" : saving ? "Saving…" : "Save to Gallery"}
          </motion.button>
        </div>
      )}

      {/* Download Options */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Download
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(["png", "jpeg", "pdf"] as const).map((fmt) => (
            <motion.button
              key={fmt}
              onClick={() => exportAs(fmt)}
              disabled={!!exporting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all disabled:opacity-50"
            >
              {exporting === fmt ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download size={14} className="text-blue-400" />
              )}
              <span className="text-[10px] font-mono uppercase text-gray-300">
                {fmt}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Copy */}
      <motion.button
        onClick={copyToClipboard}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 text-xs text-gray-300 hover:text-white transition-all"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        {copied ? "Copied!" : "Copy to Clipboard"}
      </motion.button>

      {/* Share */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Share
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={shareToTwitter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-sky-500/50 hover:bg-sky-500/10 text-xs text-gray-300 hover:text-sky-400 transition-all"
          >
            <ExternalLink size={13} />
            Twitter
          </motion.button>
          <motion.button
            onClick={shareToLinkedIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-blue-600/50 hover:bg-blue-600/10 text-xs text-gray-300 hover:text-blue-400 transition-all"
          >
            <Share2 size={13} />
            LinkedIn
          </motion.button>
        </div>
      </div>
    </div>
  );
}
