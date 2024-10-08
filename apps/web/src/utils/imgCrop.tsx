import { Area } from 'react-easy-crop/types';

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getRadianAngle = (degreeValue: number): number =>
  (degreeValue * Math.PI) / 180;

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop?: Area,
  rotation = 0,
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error("Can't create 2D canvas context");
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop?.width || 0;
  canvas.height = pixelCrop?.height || 0;

  //   ctx.putImageData(
  //     data,
  //     0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
  //     0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y,
  //   );

  if (pixelCrop?.x) {
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
    );
  }

  return new Promise<File>((resolve, reject) => {
    const rand = Math.random().toString(36).substr(2); // remove `0.`
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], `image_${rand}.jpg`));
      } else {
        reject(new Error("Can't convert canvas to blob"));
      }
    });
  });
};

/**
 * Convert file from base64 to File
 */

export function base64ToFile(base64String: string, fileName: string): File {
  // Extract the content type and base64 data from the input string
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format');
  }

  // Create a Blob from the base64 data
  const contentType = matches[1];
  const base64Data = matches[2];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  // Create a File from the Blob
  const file = new File([blob], fileName, { type: contentType });

  return file;
}
