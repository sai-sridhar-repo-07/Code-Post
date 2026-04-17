"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/types";

interface Props {
  url: string;
  theme: Theme;
  size?: number;
}

export function QRCodeCard({ url, theme, size = 64 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: size * 2,
        margin: 1,
        color: {
          dark: theme.colors.primary,
          light: "#00000000",
        },
      }).then((url) => {
        if (!cancelled) setDataUrl(url);
      });
    });
    return () => { cancelled = true; };
  }, [url, theme.colors.primary, size]);

  if (!dataUrl) {
    return (
      <div
        className="rounded-lg animate-pulse"
        style={{ width: size, height: size, backgroundColor: `${theme.colors.primary}20` }}
      />
    );
  }

  return (
    <div
      className="rounded-lg p-1.5 flex items-center justify-center"
      style={{
        backgroundColor: `${theme.colors.primary}10`,
        border: `1px solid ${theme.colors.primary}30`,
        width: size + 12,
        height: size + 12,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR Code" width={size} height={size} style={{ imageRendering: "pixelated" }} />
    </div>
  );
}
