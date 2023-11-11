import * as Bcrypt from "bcrypt";

const MAX_TOKEN_TIME = 24 * 60 * 1000;

const generateVerificationToken = (digit: number = 6) => {
  const digits = "0123456789";
  var otp = "";
  for (let i = 0; i < digit; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const encryptPassword = async (password) => {
  try {
    const hash = await Bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    return error;
  }
};

const comparePassword = async (data: {
  password: string;
  encrypt_password: string;
}): Promise<any> => {
  try {
    const same = await Bcrypt.compare(data.password, data.encrypt_password);
    if (!same) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return error;
  }
};

export {
  MAX_TOKEN_TIME,
  generateVerificationToken,
  encryptPassword,
  comparePassword,
};
