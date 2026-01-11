import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { generateOTP } from "../utils/generateOtp";
import { mailSender } from "../utils/mailer";
import { Otp } from "../models/otpModel";

const sendEmailOtp = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    // generate otp and get email from the req.user
    const otp = generateOTP();
    const email = req.user.email;
    
    try {
      // send email
      const info = await mailSender(
        email,
        "Email Verification",
        `Your verification code is ${otp}. This Code is only valid for 5 minutes`,
        `<h3>Your verification code is ${otp}. This Code is only valid for 5 minutes</h3>`
      )
      
      if (info.messageId) {
        const expiry = Date.now() + (5 * 60 * 1000);
        try {
          // first delete the old otp records
          await Otp.deleteMany({
            identifier: email,
            purpose: "verify_email",
          })
          
          // create new otp in the database
          await Otp.create({
            identifier: email,
            otpHash: otp,
            purpose: "verify_email",
            expiresAt: new Date(expiry),
          })
          res
            .status(StatusCodes.CREATED)
            .json(new ApiResponse(StatusCodes.CREATED , "OTP sent successfully", {}))
          return;
        } catch (error) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating otp", [], "");
        }
      }
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, (error as Error)?.message || "Error sending email", [], "");
    }
  }
)

const verifyEmailOtp = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { otp } = req.body;
    if (!otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "OTP and is required", [], "");
    }
    
    // get email from the req.user
    const email = req.user.email;

    // find last send otp record based on createdAt field
    const otpRecord = await Otp.findOne({
      identifier: email,
      purpose: "verify_email",
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      throw new ApiError(StatusCodes.GONE, "OTP is expired , Generate a new one", [], "");
    }

    if (otpRecord.used === true) {
      throw new ApiError(StatusCodes.GONE, "OTP is already used", [], "");
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      throw new ApiError(StatusCodes.GONE, "you have reached the maximum number of attempts", [], "");
    }

    // increase attempts
    try {
      await Otp.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error increasing attempts", [], "");
    }

    const isOTPValid = await otpRecord.compare(otp);
    if (!isOTPValid) { 
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid OTP", [], "")
    }

    try {
      await Otp.findByIdAndUpdate(otpRecord._id, {
        $set: { used: true } // set used to true, so it is only used once
      })

      await User.findOneAndUpdate(
        { email },
        { $set: { isEmailVerified: true } }
      )

      res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, "Email verified successfully", {}))
      
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        (error as Error)?.message || "Error verifying email",
        [],
        ""
      );      
    }
  }
)

export {
  sendEmailOtp,
  verifyEmailOtp
}