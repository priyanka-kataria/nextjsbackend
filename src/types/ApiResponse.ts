import { Message } from "@/Model/user";
export interface ApiResponse{
    success: Boolean;
    message: string;
    isAcceptingMessage?: boolean
    messages?:Array<Message>
}