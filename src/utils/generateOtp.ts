import crypto from "crypto";

export const generateOTP = (len: number = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
}