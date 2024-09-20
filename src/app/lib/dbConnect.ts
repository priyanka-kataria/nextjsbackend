import mongoose from "mongoose";
type ConnectionObject={
    isConeected?:number
}
const connection:ConnectionObject={}
async function  dbConnect():Promise<void>{
    if(connection.isConeected){
        console.log("alreay connected to datbase")
        return
    }
    try{
        const db= await mongoose.connect(
            `${process.env.MONGODB_URI}/database`
          );
        connection.isConeected= db.connections[0].readyState
        console.log("DB connected SuccessFullly")
    }catch(error){
        console.log(error,"Database conncetion failed")
        process.exit(1);
    }
}
export default dbConnect;