import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Connection establised.")
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/beatify`)
}

export default connectDB;