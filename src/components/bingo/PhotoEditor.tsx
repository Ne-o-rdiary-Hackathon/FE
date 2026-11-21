"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import { cropPhoto, renderPhoto } from "@/lib/bingo/photo";

interface PhotoEditorProps {
  file: File;
  onBack: () => void;
  onComplete: (blob: Blob) => void;
}

export const PhotoEditor = ({ file, onBack, onComplete }: PhotoEditorProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [cropRevision, setCropRevision] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const loaded = new window.Image();
    loaded.onload = () => setImage(loaded);
    loaded.onerror = () => setError("이미지를 불러올 수 없어요.");
    loaded.src = url;
    return () => {
      loaded.onload = null;
      loaded.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const preview = useMemo(() => {
    if (!image) return null;
    const canvas = renderPhoto(image, rotation, flipped, 1080);
    return { url: canvas.toDataURL("image/jpeg", 0.8), width: canvas.width };
  }, [image, rotation, flipped]);

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
    setCropRevision((current) => current + 1);
  };
  const handleReset = () => {
    setRotation(0);
    setFlipped(false);
    resetCrop();
  };
  const handleSave = async () => {
    if (!image || !preview || !area || isSaving) return;
    setIsSaving(true);
    try {
      onComplete(
        await cropPhoto(image, rotation, flipped, area, preview.width)
      );
    } catch {
      setError("사진을 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col bg-black text-white">
      <header className="relative flex h-13 items-center justify-center px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로 가기"
          className="absolute left-5"
        >
          <Image
            src="/icons/bingo/edit-back.svg"
            width={25}
            height={25}
            alt=""
          />
        </button>
        <h1 className="h3">사진 편집</h1>
        <button
          type="button"
          onClick={handleReset}
          className="text-text-disable body2 absolute right-5"
        >
          초기화
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-5 pb-8">
        <div className="relative mx-auto max-h-[30.125rem] min-h-64 w-full max-w-[23.125rem] flex-1">
          {preview && (
            <Cropper
              key={cropRevision}
              image={preview.url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              showGrid={false}
              classes={{ cropAreaClassName: "bingo-photo-crop-area" }}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_area, pixels) => setArea(pixels)}
              mediaProps={{ alt: "편집 중인 사진" }}
            />
          )}
          {error && (
            <p
              role="alert"
              className="absolute inset-x-0 top-0 z-10 text-center"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 pt-10">
          <span className="body2 text-text-primary rounded-full bg-white px-3 py-1 font-medium">
            1:1
          </span>
          <div className="flex gap-7">
            <button
              type="button"
              aria-label="좌우 반전"
              aria-pressed={flipped}
              onClick={() => {
                setFlipped(!flipped);
                setRotation((360 - rotation) % 360);
                resetCrop();
              }}
              className="flex size-10 items-center justify-center"
            >
              <Image
                src="/icons/bingo/flip.svg"
                width={24}
                height={24}
                alt=""
              />
            </button>
            <button
              type="button"
              aria-label="90도 회전"
              onClick={() => {
                setRotation((rotation + 90) % 360);
                resetCrop();
              }}
              className="flex size-10 items-center justify-center"
            >
              <Image
                src="/icons/bingo/rotate.svg"
                width={24}
                height={24}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 pb-8">
        <Button
          className="h-13 w-full rounded-xl text-base"
          disabled={!area || isSaving}
          onClick={handleSave}
        >
          빙고판 만들기
        </Button>
      </div>
    </main>
  );
};
