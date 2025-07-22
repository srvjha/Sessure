import { format } from "date-fns";
import { prisma } from "../configs/db";
import { logger } from "../configs/logger";
import { UserRole } from "../generated/prisma/enums";
import { ApiResponse } from "../utils/ApiResponse";
import {asyncHandler} from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sanitizeUser } from "../utils/sanitizeUser";
import { transformSessions } from "../utils/transfromSessions";
import { capitalize } from "../utils/helper";

export const getAllUsers = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const users = await prisma.user.findMany({
    where: {
      isVerified: true,
      NOT: {
        id: adminId,
      },
    },
    select: {
      id: true,
      email: true,
      fullname: true,
      avatar: true,
      role: true,
      createdAt: true,
      sessions: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
        select: {
          updatedAt: true,
          expiresAt: true,
        },
      },
      _count: {
        select: {
          sessions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers = users.map((user) => {
    const latestSession = user.sessions?.[0];
    return {
      id: user.id,
      fullname: capitalize(user.fullname),
      email: user.email,
      role: user.role,
      status: latestSession
        ? new Date() < new Date(latestSession.expiresAt)
          ? "active"
          : "expired"
        : "inactive",
      lastActive: latestSession
        ? format(new Date(latestSession.updatedAt), "d/M/yyyy, h:mm:ss a")
        : "",
      sessionsCount: user._count.sessions || 0,
    };
  });

  logger.info(`Admin fetched all users`);

  res.status(200).json(new ApiResponse(200, "Users fetched successfully", formattedUsers));
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const session = await prisma.session.findMany({
    where: { userId },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      updatedAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!session.length) {
    return res.status(200).json(new ApiResponse(200, "No sessions are active", null));
  }

  const formattedSession = await transformSessions(session);

  res
    .status(200)
    .json(new ApiResponse(200, "User sessions fetched successfully", formattedSession));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const allowedRoles = Object.values(UserRole);
  if (!role || !allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid or missing role");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  const safeUser = sanitizeUser(updatedUser);

  logger.info(`Role of ${userId} is updated successfully to ${role}`, {
    updatedBy: req.user.email,
  });

  res.status(200).json(new ApiResponse(200, "User role updated successfully", safeUser));
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: user.id } });

  logger.info(`Admin deleted user with ID ${userId}`);

  res.status(200).json(new ApiResponse(200, "User deleted successfully", null));
});

export const logoutUserSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }
   

  await prisma.session.delete({ where: { id: sessionId } });
  


  logger.info(`Session ${sessionId} deleted`, { deletedBy: req.user.email });

  res.status(200).json(new ApiResponse(200, "Session deleted successfully", null));
});
