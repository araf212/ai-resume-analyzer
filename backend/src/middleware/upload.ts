import multer from 'multer';
import { Request } from 'express';
import { config } from '../config/env';

// Store files in memory buffer only (never persisted to disk)
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword', // for older doc compatibility if needed
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const extension = file.originalname.split('.').pop()?.toLowerCase();
  const validExtension = extension === 'pdf' || extension === 'docx';
  const validMime = allowedMimeTypes.includes(file.mimetype) || file.mimetype === 'application/octet-stream';

  if (validExtension && (validMime || extension === 'docx' || extension === 'pdf')) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: "${file.originalname}". Only PDF (.pdf) and Word (.docx) files are supported.`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024, // e.g. 5 MB
    files: 1,
  },
  fileFilter,
});
