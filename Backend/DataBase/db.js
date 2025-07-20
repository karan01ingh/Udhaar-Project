import mongoose from "mongoose"
// DOTENV have to be imported and a function dotenv.config() is to be called 
import dotenv from 'dotenv'
dotenv.config()
const connect=async ()=>{
    const url=process.env.MONGODB_URI
    try { 
        await mongoose.connect(url)
        console.log("database connected successfully")
    } catch (error) {
        console.log("db is not connecting to the server",error)
    }
}
export default connect;