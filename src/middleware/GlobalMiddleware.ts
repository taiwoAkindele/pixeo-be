import { validationResult } from "express-validator";
import { jwtVerify } from "../utils/Jwt";

export const checkError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new Error(errors.array()[0].msg));
  } else {
    next();
  }
};

export const auth = async (req, res, next) => {
  const header_auth = req.headers.authorization;
  const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
  try {
    if (!token) {
      req.errorStatus = 401;
      next(new Error("User is not authenticated"));
    }
    const decoded = await jwtVerify(token);
    req.user = decoded;
    next();
  } catch (err) {
    req.errorStatus = 401;
    next(new Error("User is not authenticated"));
  }
};
