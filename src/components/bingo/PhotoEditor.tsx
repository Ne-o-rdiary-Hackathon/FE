"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import { cropPhoto, renderPhoto } from "@/lib/bingo/photo";
import { HttpError } from "@/lib/api/http-error";

interface PhotoEditorProps {
  file: File;
  onBack: () => void;
  onComplete: (blob: Blob) => Promise<void>;
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
  const saveLock = useRef(false);
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
    if (!image || !preview || !area || saveLock.current) return;
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      await onComplete(
        await cropPhoto(image, rotation, flipped, area, preview.width)
      );
    } catch (cause) {
      setError(
        cause instanceof HttpError
          ? cause.status === 409
            ? "방이나 칸의 상태가 변경됐어요. 빙고판으로 돌아가 확인해 주세요."
            : cause.status === 403
              ? "이 방에 사진을 인증할 권한이 없어요."
              : "사진을 등록하지 못했어요. 다시 시도해 주세요."
          : cause instanceof Error
            ? cause.message
            : "사진을 등록하지 못했어요. 다시 시도해 주세요."
      );
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col bg-black text-white">
      <header className="relative flex h-13 items-center justify-center px-5">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
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
          disabled={isSaving}
          className="text-text-disable body2 absolute right-5"
        >
          초기화
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-5 pb-8">
        <div
          inert={isSaving}
          className="relative mx-auto max-h-[30.125rem] min-h-64 w-full max-w-[23.125rem] flex-1"
        >
          {preview && (
            <Cropper
              key={cropRevision}
              image={preview.url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              showGrid={false}
              zoomWithScroll={!isSaving}
              onTouchRequest={() => !saveLock.current}
              onWheelRequest={() => !saveLock.current}
              classes={{ cropAreaClassName: "bingo-photo-crop-area" }}
              onCropChange={(next) => {
                if (!saveLock.current) setCrop(next);
              }}
              onZoomChange={(next) => {
                if (!saveLock.current) setZoom(next);
              }}
              onCropComplete={(_area, pixels) => {
                if (!saveLock.current) setArea(pixels);
              }}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
          {isSaving ? "인증 중..." : "인증 완료"}
        </Button>
      </div>
    </main>
  );
};
