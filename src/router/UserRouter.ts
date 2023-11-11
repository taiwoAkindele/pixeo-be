import { Router } from "express";
// import UserController from "../controllers/UserControllers";
import {
  emailTokenValidator,
  loginValidator,
  passwordResetValidator,
  resetPasswordValidator,
  signupValidator,
  verifyResetPasswordValidator,
  verifyResendEmailToken,
} from "../validators/UserValidator";
import { checkError } from "../middleware/GlobalMiddleware";
import UserController from "../controller/UserController";

const UserRouter = () => {
  const router = Router();
  const postRoutes = () => {
    router.post(
      "/signup",
      signupValidator(),
      checkError,
      UserController.signup
    );
    router.post(
      "/login",
      loginValidator(),
      checkError,
      UserController.userLogin
    );
    router.post(
      "/password-reset-token",
      passwordResetValidator(),
      checkError,
      UserController.resetPasswordOtp
    );
  };

  const getRoutes = () => {
    router.get(
      "/verify/reset-password-token",
      verifyResetPasswordValidator(),
      checkError,
      UserController.verifyResetPassword
    );
    router.get(
      "/resend/email-token",
      verifyResendEmailToken,
      checkError,
      UserController.resendEmailToken
    );
  };

  const patchRoutes = () => {
    router.patch(
      "/verify-email",
      emailTokenValidator(),
      checkError,
      UserController.verifyEmailToken
    );
    router.patch(
      "/reset-password",
      resetPasswordValidator(),
      checkError,
      UserController.resetPassword
    );
  };

  postRoutes();
  getRoutes();
  patchRoutes();

  postRoutes();

  return router;
};

export default UserRouter();
