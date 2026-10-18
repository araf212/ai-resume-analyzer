import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Multer specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Please upload a resume smaller than 5MB.',
        code: 'FILE_TOO_LARGE',
      });
    }
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`,
      code: err.code,
    });
  }

  // Custom or standard errors
  const statusCode = err.statusCode || (err.message?.includes('Invalid file type') ? 400 : 500);
  const errorMessage = err.message || 'An unexpected internal server error occurred.';

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    code: err.code || 'SERVER_ERROR',
  });
}
