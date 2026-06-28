import dotenv from "dotenv";
dotenv.config();

import aiRoutes from "./routes/ai.routes.js";
import express from "express";
import cors from "cors";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/", aiRoutes);

app.get("/", (req, res) => {
    res.send("Backend chatbot running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});

// console.log(process.env.GOOGLE_API_KEY);