import User from "../models/User";
import { jwtSign } from "../utils/Jwt";
import sendMail from "../utils/Nodemailer";
import {
  MAX_TOKEN_TIME,
  comparePassword,
  encryptPassword,
  generateVerificationToken,
} from "../utils/Utils";

const UserController = {
  signup: async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const verificationToken = generateVerificationToken();
    const fullName = firstName + " " + lastName;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", status: false });
    }

    try {
      const hash = await encryptPassword(password);

      const data = {
        email,
        emailToken: verificationToken,
        emailTokenExp: Date.now() + MAX_TOKEN_TIME,
        password: hash,
        firstName,
        lastName,
        fullName: fullName,
      };
      let user = await new User(data).save();
      const payload = {
        aud: user._id,
        email: user.email,
      };
      const token = jwtSign(payload);
      const dataOne = await User.findById(
        { _id: user._id },
        { emailToken: user.emailToken, emailTokenExp: user.emailTokenExp }
      );
      res.json({
        status: true,
        message: "Account Successfully Created",
        accessToken: token,
        data: dataOne,
      });
      await sendMail({
        to: [user.email],
        subject: "Verification Email",
        htmlPath: "../html/SignupEmail.html",
        userName: fullName,
        token: user.emailToken,
      });
    } catch (e) {
      next(e);
    }
  },

  verifyEmailToken: async (req, res, next) => {
    const email = req.user.email;
    const emailToken = req.body.otp;
    try {
      const data = await User.findOneAndUpdate(
        {
          email: email,
          emailToken: emailToken,
          emailTokenExp: { $gt: Date.now() },
        },
        {
          emailVerified: true,
          updatedAt: new Date(),
        },
        { new: true }
      );
      if (data) {
        res.json({ message: "Email Successfully Verified", success: true });
      } else {
        throw new Error("Wrong Otp or Otp has Expired");
      }
    } catch (error) {
      next(error);
    }
  },

  userLogin: async (req, res, next) => {
    const user = req.user;
    const password = req.body.password;
    const encryptedPassword = user.password;
    try {
      const check = await comparePassword({
        password: password,
        encrypt_password: encryptedPassword,
      });
      if (!check) throw new Error("Password is incorrect");
      const payload = {
        aud: user._id,
        email: user.email,
      };
      const token = jwtSign(payload);
      res.json({ message: "User Logged In", token: token, user: user });
    } catch (error) {
      next(error);
    }
  },

  resendEmailToken: async (req, res, next) => {
    const email = req.user.email;
    const verificationToken = generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          emailToken: verificationToken,
          emailTokenExp: Date.now() + MAX_TOKEN_TIME,
          updatedAt: new Date(),
        }
      );
      res.json({ message: "Email Token sent successfully", success: true });
      await sendMail({
        to: [user.email],
        subject: "Resend Email Verification",
        htmlPath: "../html/ResendEmailToken.html",
        userName: user.fullName,
        token: user.emailToken,
      });
    } catch (error) {
      next(error);
    }
  },

  resetPasswordOtp: async (req, res, next) => {
    const email = req.user.email;
    const resetPasswordToken = generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          resetPasswordToken: resetPasswordToken,
          resetPasswordTokenTime: Date.now() + MAX_TOKEN_TIME,
          updatedAt: new Date(),
        },
        { new: true }
      );
      res.json({ message: "Password Reset OTP sent", success: true });
      await sendMail({
        to: [user.email],
        subject: "Password Reset Token",
        htmlPath: "../html/ResendEmailToken.html",
        userName: user.fullName,
        token: user.resetPasswordToken,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyResetPassword: (req, res, next) => {
    try {
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    const user = req.user;
    const new_password = req.body.password;
    try {
      const encryptedPassword = await encryptPassword(new_password);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encryptedPassword,
        },
        { new: true }
      );
      if (updatedUser) {
        res.json({
          message: "Password reset successfully",
          data: updatedUser,
          success: true,
        });
      } else {
        throw new Error("User Does not Exist");
      }
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
