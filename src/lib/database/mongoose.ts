import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// eslint-disable-next-line 
let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
    // eslint-disable-next-line 
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
        }).then((conn)=>{
            console.log('Database connected successfully');
            return conn;
        }).catch((err)=>{
            console.log("error while connecting db");
            throw err;
        })

    cached.conn = await cached.promise;

    return cached.conn;
}