"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ManualGeotagSection.tsx
 * - A self-contained React + TypeScript component for Next.js
 * - Allows: image upload, manual latitude/longitude, date & time input
 * - Performs reverse geocode (OpenStreetMap Nominatim) to fill address
 * - Renders an exact-looking overlay on the uploaded image (date, coords, address)
 * - Lets the user download the modified image as a PNG
 *
 * Usage:
 * import ManualGeotagSection from '@/components/ManualGeotagSection';
 * <ManualGeotagSection />
 *
 * Notes:
 * - This component uses the browser fetch to call Nominatim. In production you
 *   should proxy requests through your backend or use a paid geocoding service
 *   with API keys and rate limits handled.
 * - The image is drawn to a canvas sized to the uploaded image while constraining
 *   maximum width for rendering purposes.
 */

type Props = {
  /** Optional callback when user "uploads" (submits) the final image and metadata */
  onSubmit?: (payload: {
    blob: Blob;
    metadata: { dateTime: string; lat: number; lon: number; address?: string };
  }) => void;
};

export default function ManualGeotagSection({ onSubmit }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dateString, setDateString] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [timeString, setTimeString] = useState<string>(() =>
    new Date().toTimeString().slice(0, 5),
  );
  const [latText, setLatText] = useState<string>("");
  const [lonText, setLonText] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load image into an <img> element so we can draw it to canvas when ready
  useEffect(() => {
    // Whenever fileUrl changes, clear previous address and errors
    setError(null);
  }, [fileUrl]);

  // Reverse geocode function using Nominatim
  async function reverseGeocode(lat: number, lon: number) {
    try {
      setIsLookingUp(true);
      setAddress("");
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "ManualGeotagSection/1.0 (your-app)",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`Geocode error: ${res.status}`);
      const json = await res.json();
      if (json.display_name) {
        setAddress(json.display_name);
      } else if (json.address) {
        const parts = [
          json.address.road,
          json.address.city || json.address.town || json.address.village,
          json.address.state,
          json.address.country,
          json.address.postcode,
        ]
          .filter(Boolean)
          .join(", ");
        setAddress(parts);
      } else {
        setAddress("");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to reverse geocode. Try again or check the coordinates.",
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setFileName(f.name);
  };

  const handleLookupClick = () => {
    setError(null);
    const lat = parseFloat(latText);
    const lon = parseFloat(lonText);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setError("Please enter valid numeric latitude and longitude.");
      return;
    }
    reverseGeocode(lat, lon);
  };

  // Draw image + overlay onto canvas
  const drawCanvas = async () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    // Ensure image is loaded
    if (!img.complete) {
      await new Promise((res) => (img.onload = res));
    }

    // Limit max width to keep canvas reasonable
    const MAX_WIDTH = 1200;
    const scale =
      img.naturalWidth > MAX_WIDTH ? MAX_WIDTH / img.naturalWidth : 1;
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the image
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Draw overlay at bottom: semi-transparent black background and white text
    const padding = Math.round(12 * (width / 375)); // scale padding by width
    const boxHeight = Math.round(100 * (width / 375));
    const boxY = height - boxHeight - padding;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, boxY, width, boxHeight + padding);

    ctx.fillStyle = "white";
    // Choose font sizes scaled by width
    const small = Math.round(12 * (width / 375));
    const medium = Math.round(14 * (width / 375));
    const large = Math.round(16 * (width / 375));

    ctx.font = `bold ${large}px sans-serif`;
    ctx.textBaseline = "top";

    const dateTime = `${dateString} ${timeString}`;
    const latLonText = `Location: ${latText || "-"}, ${lonText || "-"}`;
    const addressText = address || "";

    const x = padding;
    let y = boxY + padding;

    // Draw date/time
    ctx.fillText(`Captured: ${dateTime}`, x, y);
    y += large + 6;

    // Draw lat/lon
    ctx.font = `${medium}px sans-serif`;
    ctx.fillText(latLonText, x, y);
    y += medium + 6;

    // Draw address (wrap if necessary)
    ctx.font = `${small}px sans-serif`;
    const maxWidth = width - padding * 2;
    const lines = wrapText(ctx, addressText, maxWidth);
    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += small + 4;
    }
  };

  // Utility to wrap text into lines for canvas
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) {
    if (!text) return [""];
    const words = text.split(" ");
    const lines: string[] = [];
    let current = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(`${current} ${word}`).width;
      if (width < maxWidth) {
        current += ` ${word}`;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
    return lines;
  }

  // Whenever any of these change, redraw the preview canvas
  useEffect(() => {
    // small debounce so rapid typing doesn't re-render too quickly
    const t = setTimeout(() => {
      drawCanvas();
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, dateString, timeString, latText, lonText, address]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Failed to generate image blob.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName
        ? `${fileName.replace(/\.[^.]+$/, "")}-geotagged.png`
        : "geotagged.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Failed to generate image blob.");
        return;
      }
      if (onSubmit) {
        const lat = parseFloat(latText);
        const lon = parseFloat(lonText);
        const dateTime = `${dateString} ${timeString}`;
        onSubmit({ blob, metadata: { dateTime, lat, lon, address } });
      }
    }, "image/png");
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Manual Geotag & Image Overlay
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />

          <div className="mt-3 space-y-2">
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />

            <label className="mt-2 block text-sm font-medium">Time</label>
            <input
              type="time"
              value={timeString}
              onChange={(e) => setTimeString(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />

            <label className="mt-2 block text-sm font-medium">Latitude</label>
            <input
              type="text"
              value={latText}
              onChange={(e) => setLatText(e.target.value)}
              placeholder="e.g. -3.00176"
              className="w-full rounded border px-3 py-2"
            />

            <label className="mt-2 block text-sm font-medium">Longitude</label>
            <input
              type="text"
              value={lonText}
              onChange={(e) => setLonText(e.target.value)}
              placeholder="e.g. 104.77165"
              className="w-full rounded border px-3 py-2"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleLookupClick}
                className="rounded bg-slate-700 px-4 py-2 text-white"
                disabled={isLookingUp}
              >
                {isLookingUp ? "Looking up..." : "Lookup Address"}
              </button>
              <button
                onClick={() => {
                  setLatText("");
                  setLonText("");
                  setAddress("");
                }}
                className="rounded border px-4 py-2"
              >
                Clear
              </button>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">
                Address (auto-filled)
              </label>
              <textarea
                readOnly
                value={isLookingUp ? "Looking up address..." : address}
                rows={3}
                className="mt-1 w-full resize-none rounded border px-3 py-2"
              />
            </div>

            {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded bg-green-600 px-4 py-2 text-white"
                disabled={!fileUrl}
              >
                Download with Overlay
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-blue-600 px-4 py-2 text-white"
                disabled={!fileUrl}
              >
                Upload (submit)
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded border p-2">
            <div className="mb-2">
              <strong className="block">Preview</strong>
              <p className="text-sm text-slate-500">
                The downloaded image will include the overlay that mirrors your
                mobile app (bottom black bar with white text).
              </p>
            </div>

            <div className="w-full overflow-hidden rounded bg-black/5">
              {fileUrl ? (
                <>
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={imgRef}
                      src={fileUrl}
                      alt="uploaded"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                      }}
                      onLoad={() => drawCanvas()}
                    />
                  }
                  <canvas
                    ref={canvasRef}
                    style={{ width: "100%", display: "block", marginTop: 8 }}
                  />
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No image uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
