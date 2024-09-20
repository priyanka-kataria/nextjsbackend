import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
export async function GET(request:Request){
    dbConnect()
    try {
        
        const {username,code}=await request.json();
        const decodedUsername= decodeURIComponent(username)
        const user= await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:  "user not found",
                },
                {status:500})
        }
        const iscodevalid= user.verifyCode===code;
        const isCodeNotExpired= new Date(user.verifyCodeExpiry)>new Date()
        if(isCodeNotExpired && iscodevalid){
              user.isVarified=true;
              await user.save();
              return Response.json(
                {
                    success:true,
                    message: "Account varified succesfully",
                },
                {status:500})
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message: "varification code expired, please signup again",
                },
                {status:400})
        }else{
            return Response.json(
                {
                    success:false,
                    message: "incorrect varification code",
                },
                {status:500})
        }


    } catch (error) {
        console.log("Error varifying user", error)
    return Response.json(
        {
            success:false,
            message: "Error verifying  user",
        },
        {status:500}
    )
    }
}
    
