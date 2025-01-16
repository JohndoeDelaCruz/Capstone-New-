import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
}

export const getDataToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;
    return decodedToken.id;
  } catch (error: any) {
    console.error("Error verifying token:", error);
    return null;
  }
};