import { useRef, useState } from "react";
import "./App.css";
import Canvas from "./Canvas";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // (1) the ref is created here
  const [results, setResults] = useState<{src: string; label: string; confidence: number}[]>([]);
  const [message, setMessage] = useState<string>("");
  const THRESHOLD = 0.85;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canvasRef.current) {
      console.error("Canvas not ready");
      return;
    }

    const dataURI = canvasRef.current.toDataURL();

    try {
      const res = await fetch("http://127.0.0.1:5000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataURI }),
      });

      const result = await res.json();

      if (result.label === "flower" && result.confidence >= THRESHOLD) {
        setResults((prev) => [
        ...prev,
        {
          src: dataURI,
          label: result.label,
          confidence: result.confidence,
        },
      ]);
      setMessage("Thank you for the flower!");
      } else {
        console.log(
        `Rejected drawing: label=${result.label}, confidence=${(
          result.confidence * 100
        ).toFixed(1)}%`
      );
      setMessage("That doesn't look like a flower. Try again later.");
      }
      
    } catch (err) {
      console.error("Error contacting server:", err);
    }

    // Clear the canvas
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <>
      <div className="header">
        <h1 className="p-0 m-0">Flowers on display!</h1>
      </div>

      <div className="flower-grid">
        {results.map((item, i) => (
          <div key={i} className="flower-cell">
            <img src={item.src} alt={`flower-${i}`} />
          </div>
        ))}

        {/* Placeholder dots */}
        {Array.from({ length: Math.max(0, 16 - results.length) }).map((_, i) => (
          <div key={`ph-${i}`} className="flower-cell">
            <span className="inline-block">•</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-0.5 items-center justify-center flower-canvas">
        <form onSubmit={handleSubmit}>
          <Canvas innerRef={canvasRef} width={200} height={200} />
          <div>
            <button type="submit" className="mt-3 py-2.5 px-6 text-base text-white font-semibold border-0 rounded-lg cursor-pointer shadow-md transition-all submit-btn" style={{ backgroundColor: "var(--main-color)" }}>
              Share a flower
            </button>
          </div>
          <div id="message" className="min-h-6">
           {message}
        </div>
        </form>
      </div>
    </>
  );
}

export default App;
