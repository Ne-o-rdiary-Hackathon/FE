// Adapted from Codyssey-ROOT/codyssey-front (Apache-2.0); modified for bingo.
// Source: https://github.com/Codyssey-ROOT/codyssey-front/pull/16
// License: third-party/codyssey-front-LICENSE
import type { Area } from "react-easy-crop";

export const renderPhoto = (
  image: HTMLImageElement,
  rotation: number,
  flipped: boolean,
  maxEdge = 4096
) => {
  const sideways = rotation % 180 !== 0;
  const width = sideways ? image.naturalHeight : image.naturalWidth;
  const height = sideways ? image.naturalWidth : image.naturalHeight;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지를 편집할 수 없어요.");
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(flipped ? -scale : scale, scale);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  return canvas;
};

export const cropPhoto = async (
  image: HTMLImageElement,
  rotation: number,
  flipped: boolean,
  area: Area,
  previewWidth: number
): Promise<Blob> => {
  const source = renderPhoto(image, rotation, flipped);
  const scale = source.width / previewWidth;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지를 편집할 수 없어요.");
  context.drawImage(
    source,
    area.x * scale,
    area.y * scale,
    area.width * scale,
    area.height * scale,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("이미지를 저장하지 못했어요.")),
      "image/jpeg",
      0.92
    )
  );
};
