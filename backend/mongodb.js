import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = async(DATABASE_URL) =>{
    try{
        const DB_OPTIONS = {
            dbName: process.env.DBNAME,
            user: process.env.DBUSERNAME,
            pass: process.env.DBPASSWORD,
            authSource: process.env.DBAUTHSOURCE
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("DB Connected Successfully...")
        }catch(error){
            console.log(error)
        }
    }
  
  export default connectDB