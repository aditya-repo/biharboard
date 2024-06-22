import mongoose from "mongoose";


const database = async (DBURL) => {
    try {
        await mongoose.connect(DBURL)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database connection error: ", error)
    }
}

export { database }