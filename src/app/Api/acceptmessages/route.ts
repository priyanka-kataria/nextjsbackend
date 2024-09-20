import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
import User from "next-auth";
import { useId } from "react";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptmessage } = await request.json();

  try {
    const updatedUser = await UserModel.findById(
      userId,
      {
        isAcceptingMessage: acceptmessage,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status accept message",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance  updated succesfully",
        updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept message", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status accept message",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(useId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in getting message acceptance", error);
    return Response.json(
      {
        success: false,
        message: "error in getting message acceptance",
      },
      { status: 500 }
    );
  }
}
