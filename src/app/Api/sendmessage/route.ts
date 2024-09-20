import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
import { Message } from "@/Model/user";

export async function POST(request: Request) {
    await dbConnect();

    const {username, content}= await request.json()
    try {
        const user = await UserModel.findOne(username)
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "Usernot found"
                },
                { status: 404 }
              );
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "User is not accepting message",
                },
                { status: 403 }
              );
        }

        const newMessage=  {content, createdAt: new Date(), 

        }
        user.message.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
              success: true,
              message: "message send succefully",
            },
            { status: 200 }
          );

    } catch (error) {
        console.log(error,"unexpected error occured")
        return Response.json(
            {
              success: false,
              message: "Internal server error",
            },
            { status: 500 }
          );
    }
}