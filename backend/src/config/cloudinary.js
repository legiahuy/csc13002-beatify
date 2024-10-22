import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        // Configure Cloudinary
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });

        // Check if the configuration was successful by calling the Cloudinary API
        const result = await cloudinary.api.ping(); // Simple API call to check status
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error("Error connecting to Cloudinary");
    }
};

export default connectCloudinary;
