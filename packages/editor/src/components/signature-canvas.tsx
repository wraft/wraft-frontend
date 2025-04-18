import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Button, Flex } from "@wraft/ui";

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Canvas = styled.canvas`
  border: 1px solid #ddd;
  background: white;
  touch-action: none;
  cursor: crosshair;
  display: block;
  width: 500px;
  height: 200px;
`;

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  targetWidth?: number;
  targetHeight?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  setHasSignature?: (val: boolean) => void;
}

export function SignatureCanvas({
  canvasRef = useRef<HTMLCanvasElement>(null),
  setHasSignature = () => {},
}: SignatureCanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const pointsRef = useRef<{ x: number; y: number; pressure?: number }[]>(
    [],
  );
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.width = "500px";
    canvas.style.height = "200px";

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 500 * dpr;
    canvas.height = 200 * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, []);

  const drawSmooth = (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
  ) => {
    if (points.length < 2) return;

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
      ctx.stroke();
      return;
    }

    let i = 1;
    for (; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );

    ctx.stroke();
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    if (!ctxRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x =
      (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
    const y =
      (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

    pointsRef.current = [{ x, y }];
    setHasSignature(true);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !ctxRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
    const y =
      (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

    pointsRef.current.push({ x, y });

    if (pointsRef.current.length >= 3) {
      drawSmooth(ctxRef.current, pointsRef.current);

      if (pointsRef.current.length > 20) {
        pointsRef.current = pointsRef.current.slice(-10);
      }
    }
  };

  const endDrawing = () => {
    if (!isDrawing || !ctxRef.current) return;

    if (pointsRef.current.length > 1) {
      drawSmooth(ctxRef.current, pointsRef.current);
    }

    setIsDrawing(false);
    pointsRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseleave", endDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", endDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseleave", endDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDrawing);
    };
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;

    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
      <Flex justifyContent="space-between" mx="sm">
        <Button size="sm" variant="secondary" onClick={clearCanvas}>
          Clear
        </Button>
      </Flex>
    </CanvasContainer>
  );
}
