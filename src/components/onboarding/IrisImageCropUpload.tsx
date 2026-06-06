'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Button } from '@/components/ui/Button';

type CropKind = 'avatar' | 'cover';

type IrisImageCropUploadProps = {
  kind: CropKind;
  title: string;
  value?: string;
  onImageReady: (dataUrl: string) => void;
};

type Position = {
  x: number;
  y: number;
};

const cropConfig = {
  avatar: {
    aspectClass: 'aspect-square',
    outputWidth: 640,
    outputHeight: 640,
  },
  cover: {
    aspectClass: 'aspect-[16/6]',
    outputWidth: 1600,
    outputHeight: 600,
  },
};

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

function revokeObjectUrl(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

export function IrisImageCropUpload({
  kind,
  title,
  value,
  onImageReady,
}: IrisImageCropUploadProps) {
  const config = cropConfig[kind];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);

  const [sourceUrl, setSourceUrl] = useState(value || '');
  const [appliedUrl, setAppliedUrl] = useState(value || '');
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(1.08);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPoint, setLastPoint] = useState<Position | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setAppliedUrl(value || '');
    setSourceUrl(value || '');
  }, [value]);

  useEffect(() => {
    return () => revokeObjectUrl(sourceUrl);
  }, [sourceUrl]);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setError('');

    if (!file) return;

    if (!isImageFile(file)) {
      setError('Escolha um arquivo de imagem válido.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('A imagem precisa ter até 8MB.');
      return;
    }

    revokeObjectUrl(sourceUrl);

    const objectUrl = URL.createObjectURL(file);

    setSourceUrl(objectUrl);
    setCropMode(true);
    setZoom(1.08);
    setPosition({ x: 0, y: 0 });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!cropMode) return;

    setDragging(true);
    setLastPoint({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || !lastPoint) return;

    setPosition((current) => ({
      x: current.x + event.clientX - lastPoint.x,
      y: current.y + event.clientY - lastPoint.y,
    }));

    setLastPoint({ x: event.clientX, y: event.clientY });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    setDragging(false);
    setLastPoint(null);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // pointer já liberado pelo navegador
    }
  }

  function applyCrop() {
    const image = imageRef.current;
    const cropArea = cropAreaRef.current;

    if (!image || !cropArea) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = config.outputWidth;
    canvas.height = config.outputHeight;

    const displayWidth = cropArea.clientWidth || config.outputWidth;
    const displayHeight = cropArea.clientHeight || config.outputHeight;

    const baseScale = Math.max(
      config.outputWidth / image.naturalWidth,
      config.outputHeight / image.naturalHeight
    );

    const finalScale = baseScale * zoom;
    const drawnWidth = image.naturalWidth * finalScale;
    const drawnHeight = image.naturalHeight * finalScale;

    const scaledPositionX = position.x * (config.outputWidth / displayWidth);
    const scaledPositionY = position.y * (config.outputHeight / displayHeight);

    const drawX = (config.outputWidth - drawnWidth) / 2 + scaledPositionX;
    const drawY = (config.outputHeight - drawnHeight) / 2 + scaledPositionY;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, drawX, drawY, drawnWidth, drawnHeight);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setAppliedUrl(dataUrl);
    setCropMode(false);
    onImageReady(dataUrl);
  }

  const visibleImage = cropMode ? sourceUrl : appliedUrl || sourceUrl;
  const hasImage = Boolean(visibleImage);

  return (
    <section>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-[#002c1f]">
          {title}
        </h2>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-10 rounded-[16px] border-emerald-800/18 text-emerald-900 hover:bg-emerald-800/10"
          onClick={openFileDialog}
        >
          {hasImage ? 'Trocar' : 'Escolher'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="mb-4 rounded-[18px] border border-[#F3C9C7] bg-[#FCE8E8] px-4 py-3 text-sm text-[#8F312D]">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_140px] md:items-start">
        <div
          ref={cropAreaRef}
          role="presentation"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={[
            'relative isolate w-full overflow-hidden border border-emerald-800/12 bg-white/28 shadow-inner',
            'select-none touch-none',
            config.aspectClass,
            kind === 'avatar' ? 'max-h-[260px] rounded-[24px]' : 'max-h-[190px] rounded-[22px]',
            cropMode ? 'cursor-grab active:cursor-grabbing' : '',
          ].join(' ')}
        >
          {visibleImage ? (
            <img
              ref={imageRef}
              src={visibleImage}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 h-full w-full max-w-none object-cover"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${cropMode ? zoom : 1})`,
                transformOrigin: 'center',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={openFileDialog}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#747D79] transition-colors hover:bg-emerald-800/[0.035]"
            >
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/12 bg-white/40 text-lg text-[#002c1f]">
                +
              </span>
              <span className="text-sm">Escolher imagem</span>
            </button>
          )}

          {cropMode && (
            <div
              className={[
                'pointer-events-none absolute border-2 border-white/90',
                kind === 'avatar'
                  ? 'inset-5 rounded-full shadow-[0_0_0_999px_rgba(0,44,31,0.16)]'
                  : 'inset-4 rounded-[18px] shadow-[0_0_0_999px_rgba(0,44,31,0.10)]',
              ].join(' ')}
            />
          )}
        </div>

        <div>
          <div
            className={[
              'mx-auto overflow-hidden border-4 border-white bg-[#DDE6DA] shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
              kind === 'avatar'
                ? 'h-24 w-24 rounded-full'
                : 'aspect-[16/7] w-full rounded-[16px]',
            ].join(' ')}
          >
            {appliedUrl || sourceUrl ? (
              <img
                src={appliedUrl || sourceUrl}
                alt={kind === 'avatar' ? 'Preview do avatar' : 'Preview da capa'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[#747D79]">
                Preview
              </div>
            )}
          </div>

          {cropMode && (
            <div className="mt-4 space-y-3">
              <input
                aria-label={`Zoom da imagem de ${title}`}
                type="range"
                min="1"
                max="2.8"
                step="0.01"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-emerald-800"
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-[16px]"
                  onClick={() => {
                    setZoom(1.08);
                    setPosition({ x: 0, y: 0 });
                  }}
                >
                  Resetar
                </Button>

                <Button
                  type="button"
                  variant="auth"
                  size="sm"
                  className="rounded-[16px]"
                  onClick={applyCrop}
                >
                  Usar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
