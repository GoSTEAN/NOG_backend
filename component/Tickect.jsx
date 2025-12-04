// components/Ticket.jsx
import React, { useRef, useEffect, useCallback } from "react";

export default function Ticket({ name }) {
  const canvasRef = useRef(null);

  const generateTicket = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 300;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#0a1f3d");
    gradient.addColorStop(0.5, "#0d2b5a");
    gradient.addColorStop(1, "#102f6d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.textAlign = "center";
    ctx.fillText("ABUJA NIGHT OF GLORY 2025", canvas.width / 2, 60);

    // VIP Badge
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("VIP TICKET", canvas.width / 2, 110);

    // Name
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name.toUpperCase(), canvas.width / 2, 160);

    // Details
    ctx.font = "20px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Date: 5th - 7th December 2025", canvas.width / 2, 200);
    ctx.fillText("Venue: Moshood Abiola National Stadium, Abuja", canvas.width / 2, 230);

    // Decorative border
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  }, [name]);

  useEffect(() => {
    if (name) generateTicket();
  }, [name, generateTicket]);

  const downloadTicket = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `NIGHT_OF_GLORY_2025_VIP_${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-b from-gray-900 to-black">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Your VIP Ticket</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-2xl">
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>

      <button
        onClick={downloadTicket}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold text-xl rounded-full hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Download Your VIP Ticket
      </button>

      <p className="mt-6 text-gray-400 text-center max-w-md">
        Present this ticket at the VIP entrance. God bless you as you join us for this glorious night!
      </p>
    </div>
  );
}