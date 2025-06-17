import connectDB from "./db/indes.js";
import dotenv from "dotenv";
import { app } from "./app.js";


dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 4021;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!!", err);
    });
