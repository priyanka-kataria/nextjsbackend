import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
import User from "next-auth";
import { useId } from "react";
import mongoose from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
}
