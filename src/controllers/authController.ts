import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { generateOTP } from "../utils/generateOtp";
import { mailSender } from "../utils/mailer";
import { Otp } from "../models/otpModel";
import { emailBodySchema, verifyPassSchema, resetPassSchema } from "../schema/authValidation";
import bcrypt from "bcryptjs";
import { treeifyError } from "zod";
import { ResetToken } from "../models/resetTokenModel";
import crypto from "crypto";

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
        `<p>Your verification code is <b>${otp}</b>. This Code is only valid for 5 minutes</p>`
      )

      if (info.messageId) {
        const expiry = Date.now() + (5 * 60 * 1000);
        try {
          // first delete the old otp records
          await Otp.deleteMany({
            identifier: email,
            purpose: "verify_email",
          })

          // hash otp
          const otpHash = await bcrypt.hash(otp, 10);
          
          // create new otp in the database
          await Otp.create({
            identifier: email,
            otpHash: otpHash,
            purpose: "verify_email",
            expiresAt: new Date(expiry),
          })
          res
            .status(StatusCodes.CREATED)
            .json(new ApiResponse(
              StatusCodes.CREATED,
              "An OTP has been sent to your email if it is exists",
              {}
            ))
          return;
        } catch (error) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error storing otp", [], "");
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

    // compare otp
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

const sendResetPasswordOtp = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { success, data } = emailBodySchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Please give a valid email", [], "");
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User with this email not exist", [], "");
    }

    try {
      const otp = generateOTP(); // 6 dig otp

      // send otp
      const info = await mailSender(
        data.email,
        "Password Reset Verification",
        `Your reset password verification code is ${otp}. This Code is only valid for 5 minutes`,
        `<p>Your reset password verification code is <b>${otp}</b>. This Code is only valid for 5 minutes</p>`
      )
      
      if (info.messageId) {
        try {
          // first delete all the previous otp records
          await Otp.deleteMany({
            identifier: data.email,
            purpose: "reset_pass",
          })
          
          // hash otp
          const otpHash = await bcrypt.hash(otp, 10);
          
          // create new one
          await Otp.create({
            identifier: data.email,
            otpHash: otpHash,
            purpose: "reset_pass",
            expiresAt: new Date(Date.now() + (5 * 60 * 1000)) // 5 min
          });
          res
            .status(StatusCodes.CREATED)
            .json(new ApiResponse(
              StatusCodes.CREATED,
              "An OTP has been sent to your email if it is exists",
              {}
            ))
        } catch(error) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message || "Error storing otp in db", [], "")
        }
      }
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR, 
        "Error sending opt",
        [], ""
      )
    }

  }
)

const verifyResetPasswordOtp = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { success, data, error } = verifyPassSchema.safeParse(req.body);
    
    if (!success) {
      const errors = treeifyError(error).errors
      throw new ApiError(StatusCodes.BAD_REQUEST, errors[0], errors, "")
    }

    // find last send otp record based on createdAt field
    const otpRecord = await Otp.findOne({
      identifier: data.email,
      purpose: "reset_pass",
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

    // compare otp
    const isOTPValid = await otpRecord.compare(data.otp);
    if (!isOTPValid) { 
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid OTP", [], "")
    }

    try {
      await Otp.findByIdAndUpdate(otpRecord._id, {
        $set: { used: true } // set used to true, so it is only used once
      })

      const user = await User.findOne({ email: data.email }).select("_id");
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User with this email not exist", [], "");
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(crypto.randomBytes(16).toString("hex"))
        .digest("hex");
      const resetToken = await ResetToken.create({
        userId: user._id,
        tokenHash: tokenHash,
        expiresAt: new Date(Date.now() + (5 * 60 * 1000)),
      })

      res
        .status(StatusCodes.OK)
        .json(new ApiResponse(
          StatusCodes.OK,
          "Email verified successfully for password reset",
          { resetToken: resetToken.tokenHash }
        ))
      
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        (error as Error)?.message || "Error verifying email for password reset",
        [],
        ""
      );      
    }
  }
)

const resetPassword = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized, reset token required", [], "");
    }
    
    const { success, data, error } = resetPassSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Password must contains more then 6 letters",
        treeifyError(error).errors,
        ""
      )
    }

    const resetToken = await ResetToken.findOneAndUpdate(
      {
        tokenHash: token,
        used: false,
        expiresAt: { $gt: new Date() }
      },
      { $set: { used: true } },
      { new: true } // return the updated document
    );

    if (!resetToken) {
      throw new ApiError(StatusCodes.GONE, "Reset token is invalid, expired, or already used", [], "");
    }

    const user = await User.findByIdAndUpdate(resetToken.userId, {
      $set: { password: data.newPassword }
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found", [], "");
    }

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, "Password reset successfully", {}))
  }
)

export {
  sendEmailOtp,
  verifyEmailOtp,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword
}