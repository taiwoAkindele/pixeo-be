import * as jwt from "jsonwebtoken";

export const jwtSign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "180d",
    issuer: "akindelet01@gmail.com",
  });
};

export const jwtVerify = async (token: string): Promise<any> => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new Error("User is not authorized");
    }
    return decoded;
  } catch (err) {
    throw err;
  }
};
