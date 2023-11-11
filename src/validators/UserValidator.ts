import { body, param } from "express-validator";
import User from "../models/User";

export const signupValidator = () => {
  return [
    body("firstName", "First name is required").isString(),
    body("lastName", "Last name is required").isString(),
    body("email", "Email is required")
      .isEmail()
      .custom(async (email, { req }) => {
        try {
          const user = await User.findOne({ email: email });
          if (user) {
            throw new Error("User Already Exists");
          } else {
            return true;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }),
    body("password", "Password is required")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8-20 characters"),
    body("confirmPassword", "Confirm Password is required")
      .notEmpty()
      .withMessage("Confirm Password must be between 8-20 characters"),
  ];
};
export const emailTokenValidator = () => {
  return [body("otp", "Email verification token is required").isNumeric()];
};

export const loginValidator = () => {
  return [
    body("email", "Email is required")
      .isEmail()
      .custom(async (email, { req }) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            throw new Error("User not found");
          } else if (!user.emailVerified) {
            throw new Error("Unverified Email");
          } else {
            req.user = user;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }),
    body("password", "Password is required").isNumeric(),
  ];
};

export const passwordResetValidator = () => {
  return [
    body("email", "Email is required")
      .isString()
      .custom(async (email, { req }) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            throw new Error("User not found");
          } else {
            req.user = user;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }),
  ];
};

export const verifyResetPasswordValidator = () => {
  return [
    param("email", "Email is required").isEmail(),
    param("token", "Reset Password Token is required")
      .isString()
      .custom(async (token, { req }) => {
        try {
          const user = await User.findOne({
            email: req.body.email,
            resetPasswordToken: token,
            resetPasswordTokenTime: { $gt: Date.now() },
          });
          if (user) {
            return true;
          } else {
            throw "Reset Password Token has expired!";
          }
        } catch (error) {
          throw new Error(error);
        }
      }),
  ];
};

export const resetPasswordValidator = () => {
  return [
    body("email", "Email is required")
      .isEmail()
      .custom(async (email, { req }) => {
        try {
          const user = await User.findOne({
            email: email,
          });
          if (user) {
            req.user = user;
            return true;
          } else {
            throw "Email Does not Exist";
          }
        } catch (error) {
          throw new Error(error);
        }
      }),
    body("password", "New Password is Required")
      .isAlphanumeric()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8-20 characters"),
    body("confirmPassword", "Confirm Password is required")
      .notEmpty()
      .withMessage("Confirm Password must be between 8-20 characters"),
    body("otp", "Password verification token is required")
      .isNumeric()
      .custom((otp, { req }) => {
        if (req.user.resetPasswordToken === otp) {
          return true;
        } else {
          req.errorStatus = 422;
          throw "Invalid Password Token. Please try again";
        }
      }),
  ];
};
