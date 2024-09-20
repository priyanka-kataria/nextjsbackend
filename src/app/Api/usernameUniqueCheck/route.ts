import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";
import {z} from "zod"
import { usernameValidation } from "@/Schemas/SignUpSchema";
import { request } from "http";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const UsernameQuerySchema= z.object({
   username:usernameValidation

})

export async function GET(request:Request){
  await dbConnect();
//   localhost:3000/api/cuu?username=hitesh

// if(request.method!=='GET'){
//     return Response.json(  {
//         success:false,
//         message: "Method not allowd",
//     },
//     {status:405})
// }
  try {
     const {searchParams}= new URL(request.url)
     const queryParam={
        username: searchParams.get('username')
     }
     const result= UsernameQuerySchema.safeParse(queryParam)
    //  console.log(searchParams,"erordcd");
     console.log(queryParam,"erordcd");
    //  if(!result.success){
    //     const usernameErrors= result.error.format().username?._errors || []
    //     return Response.json(  {
    //         success:false,
    //         message: usernameErrors.join()
    //     },
    //     {status:400})
    //  }
     const {username}= queryParam
    const existingVerifiedUser= await UserModel.findOne({
        username, isVarified:true
    })
    
    if(existingVerifiedUser){
        return Response.json(
            {
                success:false,
                message: "username is already takean",
            },
            {status:400}
        )
    }
    return Response.json(
        {
            success:true,
            message: "username is unique",
        },
        {status:200}
    )

  } catch (error) {
    console.log("Error checking username", error)
    return Response.json(
        {
            success:false,
            message: "Error checking hhhg username",
        },
        {status:500}
    )
  }
}