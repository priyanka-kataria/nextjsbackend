import {resend} from '@/app/lib/resend';

import varificationEmail from "../../Emails/varificationEmail"
import { ApiResponse } from '@/types/ApiResponse';
export async function  sendVerificationEmail(
  email:string,
  username:string,
  verifyCode:string
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: varificationEmail({username,otp:verifyCode}),
          });
        return { success: true, message:" verification email send succesfully"}
    }catch(emailError){
        console.log("error sending verification email",emailError )
        return { success: false, message:"Failed to send verification email"}
    }
}