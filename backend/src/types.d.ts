import { User } from "./generated/prisma/client";

export type decodedUser = Pick<User, "id" | "email" | "role">;

declare global {
  namespace Express {
    interface Request {
      user: decodedUser;
    }
  }
}
export {};
