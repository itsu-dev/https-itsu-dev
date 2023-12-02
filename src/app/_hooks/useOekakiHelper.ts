'use client';

import React, { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT, IMAGE_MAX_DRAW_COUNT, IMAGE_SIZE } from '@/app/_consts/oekaki';
import { decodeImage, encodeImage } from '@/app/_features/oekakiutils';
import { useRouter } from 'next/navigation';

type ReturnType = {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  setCanvas: (c: HTMLCanvasElement) => void;
  setColor: Dispatch<string>;
  setDescription: Dispatch<string>;
  setAuthor: Dispatch<string>;
  finalize: () => Promise<void>;
  timer: number;
  drawCount: number;
  color: string;
  description: string;
  author: string;
  initialized: boolean;
  masterImage: OekakiImage | null;
}

export default function useOekakiHelper(imageId: string): ReturnType {
  const router = useRouter();

  const timerId = useRef<NodeJS.Timeout | null>(null);
  const previousPoint = useRef<[number, number]>([0, 0]);

  const [initialized, setInitialized] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(DRAWING_TIME_LIMIT);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setDrawing] = useState<boolean>(false);
  const [drawCount, setDrawCount] = useState<number>(0);
  const [color, setColor] = useState<string>('rgb(0,0,0)');
  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [masterImage, setMasterImage] = useState<OekakiImage | null>(null);

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
  }, [canvas, color, drawCount]);

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

  const onMouseUp = useCallback(() => {
    if (!isDrawing || drawCount >= DRAWING_COUNT_LIMIT) {
      return;
    }

    setDrawing(false);
    setTimer(DRAWING_TIME_LIMIT);
    setDrawCount((prev) => prev + 1);
    clearTimeout(timerId.current!);
  }, [drawCount, isDrawing]);

  const finalize = useCallback(async (): Promise<void> => {
    if (drawCount < 1) {
      alert('最低でも1筆は描いてください！');
      return;
    }

    const gc = canvas!.getContext('2d')!;
    const img = gc.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE).data;

    const encoded = encodeImage(new Uint8Array(img));
    const response = await fetch('https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: description.length === 0 ? null : description,
        author: author.length === 0 ? null : author,
        id: imageId.length === 0 ? null : imageId,
        payload: Array.from(encoded),
        _bs: canvas!.toDataURL('image/jpeg', 0.9),
      }),
    });

    const json = await response.json() as Result<string>;

    if (json.success) {
      alert('投稿しました！');
      router.push(`/oekaki?gallery=${json.result}`);

    } else {
      alert('エラーが発生しました...');
    }
  }, [author, canvas, description, drawCount, imageId, router]);

  useEffect(() => {
    if (!initialized && canvas) {
      (async () => {
        const g = canvas.getContext('2d');
        if (imageId) {
          const imageData = await fetch(`https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/image?image_id=${imageId}`);

          if (!imageData.ok) {
            alert('エラーが発生しました...1');
            return;
          }

          const json = await imageData.json() as Result<OekakiImage>;
          if (!json.success) {
            alert('エラーが発生しました...2');
            return;
          }

          if (g == null) {
            alert('エラーが発生しました...');
            return;
          }

          if (json.result.count >= IMAGE_MAX_DRAW_COUNT) {
            router.push(`/oekaki?gallery=${imageId}`);
            return;
          }

          setMasterImage(json.result);

          if (json.result.type === 'bin') {
            g.putImageData(decodeImage(g, new Uint8Array(json.result.payload!)), 0, 0);
          } else {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = `https://i.imgur.com/${json.result.imgurId}.jpg`;
            img.onload = () => {
              g.drawImage(img, 0, 0);
            }
          }

        } else if (g) {
          g.fillStyle = 'white';
          g.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
        }

        if (g) {
          g.strokeStyle = color;
          g.lineWidth = 3;
        }

        setInitialized(true);
      })();
    }

    document.addEventListener('pointerup', onMouseUp);

    return () => {
      document.removeEventListener('pointerup', onMouseUp);
    };
  }, [canvas, color, imageId, initialized, onMouseUp, router]);

  return {
    onMouseDown,
    onMouseMove,
    finalize,
    setCanvas,
    setColor,
    setDescription,
    setAuthor,
    timer,
    drawCount,
    color,
    description,
    author,
    initialized,
    masterImage
  };
}