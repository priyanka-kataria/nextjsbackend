import exp from 'constants';
import mongoose,{Schema,Document} from 'mongoose';
import { Content } from 'next/font/google';

export interface Message extends Document{
    content: String;
   createdAt: Date
}
const MessageSchema: Schema<Message>=new Schema( {
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now
        
    },
   
} );
export interface User extends Document{
    username: string;
   email: String;
   password: string;
   verifyCode: string;
   verifyCodeExpiry: Date;
   isVarified: boolean,
   isAcceptingMessage: boolean;
   message: Message[];

}
const UserSchema: Schema<User>=new Schema( {
    username: {
        type: String,
        required: [true,"Username is required"],
        unique: true,
        lowercase: true,
        trim:true
    },
    email: {
        type: String,
        required:[true,"Email is required"],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "please etner valid email"],
    },
    password: {
        type: String,
        required:[ true,"Password is required"]
    },
    verifyCode:{
        type: String,
        required:[ true,"varify code is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required:[ true,"varify  Expiry is required"]
    },
    isVarified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    message:[ MessageSchema] 
} );

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema)
export default UserModel;