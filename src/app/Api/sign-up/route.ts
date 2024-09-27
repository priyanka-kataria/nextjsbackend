'use-client'
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVarificationEmail";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password,isVarified } = await request.json();
    const existingUserVerifiedBYUsername = await UserModel.findOne({
      username,
      isVarified: true,
    });
    if (existingUserVerifiedBYUsername) {
      return Response.json(
        { success: false, message: "Username already  taken" },
        { status: 400 }
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVarified) {
        console.log("hello guys")
        return Response.json(
          {
            success: false,
            message: "user already exist this email",
          },
          {
            status: 500,
          }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hasedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVarified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      console.log("hello girls")
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User resisterd succesfully varify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error resistering user", error);
    return Response.json(
      {
        success: false,
        message: "Error resistering user",
      },
      {
        status: 500,
      }
    );
  }
}
