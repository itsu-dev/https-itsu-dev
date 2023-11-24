'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLOR_PALETTE, DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT } from '@/app/_consts/oekaki';
import { decodeImage, encodeImage } from '@/app/_features/oekakiutils';

type ReturnType = {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  setCanvas: (c: HTMLCanvasElement) => void;
  finalize: () => Promise<boolean>;
  timer: number;
  drawCount: number;
}

type Args = {
  onOekakiStart: VoidFunction;
  color: string;
}

export default function useOekakiHelper({ onOekakiStart, color }: Args): ReturnType {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const previousPoint = useRef<[number, number]>([0, 0]);
  const initialized = useRef<boolean>(false);
  const [timer, setTimer] = useState<number>(DRAWING_TIME_LIMIT);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setDrawing] = useState<boolean>(false);
  const [drawCount, setDrawCount] = useState<number>(0);

  useEffect(() => {
    if (!initialized.current && canvas) {
      initialized.current = true;

      const g = canvas.getContext('2d');
      if (g == null) {
        return;
      }
      g.fillStyle = 'white';
      g.fillRect(0, 0, 512, 512);
      g.lineWidth = 3;
    }
  }, [canvas, initialized]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawCount >= DRAWING_COUNT_LIMIT) {
      return;
    }

    const rect = canvas!.getBoundingClientRect();
    previousPoint.current = [e.clientX - rect.x, e.clientY - rect.y];
    setDrawing(true);
    setTimer(DRAWING_TIME_LIMIT);

    canvas!.getContext('2d')!.strokeStyle = color;

    const startTime = new Date().getTime();
    timerId.current = setInterval(() => {
      const delta = new Date().getTime() - startTime;
      setTimer(DRAWING_TIME_LIMIT - delta);
      if (delta > DRAWING_TIME_LIMIT) {
        setTimer(0);
        clearTimeout(timerId.current!);
      }
    }, 10);
    onOekakiStart();
  }, [canvas, color, drawCount, onOekakiStart]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || timer === 0 || drawCount >= DRAWING_COUNT_LIMIT) {
      return;
    }
    const rect = canvas!.getBoundingClientRect();
    const point: [number, number] = [e.clientX - rect.x, e.clientY - rect.y];
    const g = canvas!.getContext('2d')!;
    g.beginPath();
    g.moveTo(...previousPoint.current);
    g.lineTo(...point);
    g.stroke();
    g.closePath();
    previousPoint.current = point;
  }, [canvas, drawCount, isDrawing, timer]);

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawCount >= DRAWING_COUNT_LIMIT) {
      return;
    }

    setDrawing(false);
    setTimer(DRAWING_TIME_LIMIT);
    setDrawCount((prev) => prev + 1);
    clearTimeout(timerId.current!);
  }, [drawCount]);

  const finalize = useCallback(async (): Promise<boolean> => {
    const gc = canvas!.getContext('2d')!;
    const img = gc.getImageData(0, 0, 512, 512).data;

    // TODO
    const decoded = decodeImage(gc, encodeImage(new Uint8Array(img)));
    gc.putImageData(decoded, 0, 0);
    return true;
  }, [canvas]);

  return { onMouseDown, onMouseMove, onMouseUp, finalize, setCanvas, timer, drawCount };
}