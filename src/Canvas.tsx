import React, { useEffect, useRef } from "react";

type CanvasProps = {
  width: number;
  height: number;
  innerRef?: React.RefObject<HTMLCanvasElement | null>;
};

function Canvas({ width, height, innerRef }: CanvasProps) {
  const canvasRef = innerRef ?? useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const painting = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pen Tool
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";

    ctxRef.current = ctx; // For undo

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();

      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const startPainting = (e: MouseEvent | TouchEvent) => {
      painting.current = true;
      lastPos.current = getPos(e);
    };

    const stopPainting = () => {
      painting.current = false;
      lastPos.current = null; 
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!painting.current || !lastPos.current) return;

      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPos.current = pos; 
    };

    // Mouse Events
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("mousemove", draw);

    // Touch Events
    canvas.addEventListener("touchstart", startPainting);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopPainting);
    canvas.addEventListener("touchcancel", stopPainting);

    // Clean up
    return () => {
      // Mouse
      canvas.removeEventListener("mousedown", startPainting);
      canvas.removeEventListener("mouseup", stopPainting);
      canvas.removeEventListener("mouseleave", stopPainting);
      canvas.removeEventListener("mousemove", draw);

      // Touch
      canvas.removeEventListener("touchstart", startPainting);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopPainting);
      canvas.removeEventListener("touchcancel", stopPainting);
    };
  }, []);

  // undo button handler
  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "2px solid blue", touchAction: "none", borderRadius: "4px" }}
      />
      <button
      type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleUndo();
        }}
        id="undo-btn"
        className="border-2 rounded-sm py-1 px-2 ml-1 h-fit cursor-pointer"
      >
        ↻
      </button>
    </div>
  );
}

export default Canvas;
