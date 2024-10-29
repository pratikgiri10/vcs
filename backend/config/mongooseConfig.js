import mongoose from 'mongoose';

const connectDB = async () => {
    try{
       const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDb connected: ${connection.connection.host}`);
        
     }catch(err){
         console.log("error connecting: ",err);
     }
}

export default connectDB;