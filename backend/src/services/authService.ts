import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export { hashPassword, comparePassword, generateToken };
