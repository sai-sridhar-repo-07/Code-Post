"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, ExternalLink } from "lucide-react";
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
  const [exporting, setExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
