import { Area } from 'react-easy-crop/types';

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
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
  
if(pixelCrop?.x) {
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  )
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


// const createImage = (url:string) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => resolve(image));
//     image.addEventListener('error', error => reject(error));
//     image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
//     image.src = url;
//   });

// function getRadianAngle(degreeValue:number) {
//   return (degreeValue * Math.PI) / 180;
// }

// /**
//  * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
//  * @param {File} image - Image File url
//  * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
//  * @param {number} rotation - optional rotation parameter
//  */
// export default async function getCroppedImg(imageSrc:string, pixelCrop:string, rotation = 0) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   const maxSize = Math.max(image?.width, image?.height);
//   const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

//   // set each dimensions to double largest dimension to allow for a safe area for the
//   // image to rotate in without being clipped by canvas context
//   canvas.width = safeArea;
//   canvas.height = safeArea;

//   // translate canvas context to a central location on image to allow rotating around the center.
//   ctx.translate(safeArea / 2, safeArea / 2);
//   ctx.rotate(getRadianAngle(rotation));
//   ctx.translate(-safeArea / 2, -safeArea / 2);

//   // draw rotated image and store data.
//   ctx.drawImage(
//     image,
//     safeArea / 2 - image.width * 0.5,
//     safeArea / 2 - image.height * 0.5,
//   );
//   const data = ctx.getImageData(0, 0, safeArea, safeArea);

//   // set canvas width to final desired crop size - this will clear existing context
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   // paste generated rotate image with correct offsets for x,y crop values.
//   ctx.putImageData(
//     data,
//     Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
//     Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
//   );

//   // As Base64 string
//   // return canvas.toDataURL('image/jpeg');

//   // As a blob
//   return new Promise(resolve => {
//     canvas.toBlob(file => {
//       resolve(URL.createObjectURL(file));
//     }, 'image/jpeg');
//   });
// }
