import createError from "../utils/createError.js";
import prisma from "../db/prisma.js";
import bcrypt from "bcrypt";

export const getSingleUser = async (req, res, next) => {
  const id  = Number(req.params.id);
  try {
    const User = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).send(User);
  } catch (err) {
    console.error(err)
    next(err);
  }
};
export const deleteUser = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) return next(createError(403, "User not found"));
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send("UserDeleted");
  } catch (err) {
    next(err);
  }
};
export const updateUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return next(createError(400, "No data provided for update"));
  }
  try {
  
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) return next(createError(404, "User not found"));
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.password !== undefined && {
          password: bcrypt.hashSync(data.password, 10),
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.code === 'P2002') { // Prisma unique constraint error
      return next(createError(400, "Email already exists"));
    }
    next(err);
  }
};
