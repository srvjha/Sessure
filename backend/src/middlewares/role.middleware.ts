import {asyncHandler} from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  console.log({role})

  if (role !== "admin") {
    throw new ApiError(403, "Access denied. Admins only.");
  }

  next();
});
