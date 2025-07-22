import { Request, Response, NextFunction } from "express";
import { logger } from "../configs/logger";
import { ApiError } from "../utils/ApiError";
import { Prisma } from "../generated/prisma/client";
import { MulterError } from "multer";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  let apiError: ApiError;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        apiError = new ApiError(
          409,
          `${(error.meta?.target as string[] | undefined)?.join(", ") || "Field"} already exists`,
        );
        break;

      case "P2025":
        apiError = new ApiError(404, `${error.meta?.modelName || "Resource"} not found`);
        break;

      case "P2003":
        apiError = new ApiError(
          400,
          `Foreign key constraint failed on ${error.meta?.field_name || "a related field"}.`,
        );
        break;
      default:
        apiError = new ApiError(400, "Database request error");
        break;
    }
  } else if (error instanceof MulterError) {
    let message = "File upload error";
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum size allowed is 2MB.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Too many files. Only 1 file is allowed.";
        break;
    }

    apiError = new ApiError(400, message);
  } else if (error instanceof ApiError) {
    apiError = error;
  } else {
    apiError = new ApiError(500, error.message || "Internal Server Error");
  }

  logger.error(apiError.message, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: apiError.stack || "",
  });

  res.status(apiError.statusCode).json({
    code: apiError.statusCode,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success,
  });
};
