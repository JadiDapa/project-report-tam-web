"use client";

import { useRef, useState, useEffect } from "react";

export default function TicketDetail() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mainLocation, setMainLocation] = useState(""); // Editable
  const [subLocation, setSubLocation] = useState(""); // Editable
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set default date/time on mount
  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString("en-GB")); // Format: dd/mm/yyyy
    setTime(now.toLocaleTimeString("en-GB")); // Format: hh:mm:ss
  }, []);

  // Reverse geocoding using Nominatim
  const reverseGeocode = async (lat: string, lon: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );
      const data = await res.json();
      const { address } = data;

      const main = [
        address.city || address.county || "",
        address.state || "",
        address.country || "",
      ]
        .filter(Boolean)
        .join(", ");

      const sub = [
        address.road,
        address.suburb,
        address.village,
        address.postcode,
        address.city_district,
      ]
        .filter(Boolean)
        .join(", ");

      return { main, sub };
    } catch (err) {
      console.error("Failed to reverse geocode", err);
      return { main: "", sub: "" };
    }
  };

  // Detect GPS and auto-fill fields
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      setLatitude(lat);
      setLongitude(lon);

      const { main, sub } = await reverseGeocode(lat, lon);
      setMainLocation(main);
      setSubLocation(sub);
    });
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const drawOverlay = () => {
    if (!canvasRef.current || !imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvasWidth = image.width;
      const canvasHeight = image.height;
      const boxHeight = 188;
      const mapSize = 188;
      const boxRadius = 10;
      const spacing = 14;
      const innerPadding = 12;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw the original image
      ctx.drawImage(image, 0, 0);

      // Calculate positions
      const mapX = 24;
      const mapY = canvasHeight - mapSize - 18;

      const boxX = mapX + mapSize + spacing;
      const boxY = canvasHeight - boxHeight - 18;
      const boxWidth = canvasWidth - boxX - 24;

      // Draw map (placeholder)
      ctx.fillStyle = "green";
      ctx.fillRect(mapX, mapY, mapSize, mapSize);

      ctx.beginPath();
      ctx.arc(mapX + mapSize / 2, mapY + mapSize / 2, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // Draw rounded black box (beside the map)
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.moveTo(boxX + boxRadius, boxY);
      ctx.lineTo(boxX + boxWidth - boxRadius, boxY);
      ctx.quadraticCurveTo(
        boxX + boxWidth,
        boxY,
        boxX + boxWidth,
        boxY + boxRadius,
      );
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - boxRadius);
      ctx.quadraticCurveTo(
        boxX + boxWidth,
        boxY + boxHeight,
        boxX + boxWidth - boxRadius,
        boxY + boxHeight,
      );
      ctx.lineTo(boxX + boxRadius, boxY + boxHeight);
      ctx.quadraticCurveTo(
        boxX,
        boxY + boxHeight,
        boxX,
        boxY + boxHeight - boxRadius,
      );
      ctx.lineTo(boxX, boxY + boxRadius);
      ctx.quadraticCurveTo(boxX, boxY, boxX + boxRadius, boxY);
      ctx.closePath();
      ctx.fill();

      // Draw text inside box
      const textX = boxX + innerPadding;
      let textY = boxY + innerPadding + 18;

      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = " 28px sans-serif";
      wrapText(
        ctx,
        mainLocation,
        textX,
        textY,
        boxWidth - innerPadding * 2,
        30,
      );

      textY += 64;
      ctx.font = "20px sans-serif";
      wrapText(ctx, subLocation, textX, textY, boxWidth - innerPadding * 2, 18);

      textY += 55;
      ctx.fillText(`Lat ${latitude}°  Long ${longitude}°`, textX, textY);

      textY += 24;
      ctx.fillText(`${date} ${time}`, textX, textY);
    };
  };

  // Utility to wrap long text
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ): number {
    const words = text.split(" ");
    let line = "";
    let linesUsed = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
        linesUsed++;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, x, y);
    linesUsed++;
    return linesUsed * lineHeight;
  }

  // Save canvas image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "image-with-overlay.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="relative flex w-full p-4">
      <div className="mx-auto max-w-2xl flex-1 space-y-4">
        <input
          type="file"
          accept="image/*"
          className="w-full border px-2 py-1"
          onChange={handleImageUpload}
        />

        <input
          type="text"
          placeholder="Main Location (e.g., Kecamatan Ilir Timur II)"
          value={mainLocation}
          onChange={(e) => setMainLocation(e.target.value)}
          className="w-full border px-2 py-1"
        />
        <input
          type="text"
          placeholder="Sub-location (e.g., Jl. Yayasan I No.1867)"
          value={subLocation}
          onChange={(e) => setSubLocation(e.target.value)}
          className="w-full border px-2 py-1"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border px-2 py-1"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1"
          />
          <input
            type="text"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border px-2 py-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={detectLocation}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            Detect Location
          </button>
          <button
            onClick={drawOverlay}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Generate
          </button>
          <button
            onClick={downloadImage}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Download
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="aspect-[9/16] h-[85vh] rounded border shadow"
      />
    </section>
  );
}
