// controllers/upload-s3.controller.ts
import { Request, Response } from 'express';
import HTTP_STATUS_CODES from '../types/http-status-codes';

// Guardar la URL de una sola imagen
export const saveSingleImage = (req: Request, res: Response): string => {
  const file = req.file as Express.MulterS3.File;

  if (!file) {
    res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send({ message: 'No se ha subido ninguna imagen' });
  }

  const url = file.location;
  return url;
};

// Guardar las URLs de múltiples imágenes
export const saveMultipleImages = (req: Request, res: Response): string[] => {
  const files = req.files as Express.MulterS3.File[];

  if (!files || files.length === 0) {
    res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .send({ message: 'No se han subido imágenes' });
  }

  const images = files.map((file) => file.location);
  return images;
};
