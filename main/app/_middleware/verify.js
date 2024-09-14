import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

export const verifyToken = async (token) => {

  if (!token) {
    return { message: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    
    return userId;
  } catch (error) {
    return { message: 'Invalid token', error: error.message};
  }
};