import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY as string;

export const verifyToken = async (token: any) => {
  if (!token) {
    return { message: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    
    // Check if `decoded` is an object and has `uId`
    const userId = typeof decoded === 'object' && 'uId' in decoded ? decoded.uId : null;

    if (!userId) {
      return { message: 'Invalid token structure' };
    }

    return userId;
  } catch (error: any) {
    return { message: 'Invalid token', error: error.message };
  }
};
