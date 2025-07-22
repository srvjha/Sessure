import { User } from "../generated/prisma/client";

export const sanitizeUser = (user: User) => {
  const {
    password,
    verificationToken,
    verificationTokenExpiry,
    resetPasswordToken,
    resetPasswordExpiry,
    createdAt,
    updatedAt,
    ...safeUser
  } = user;
  return safeUser;
};
