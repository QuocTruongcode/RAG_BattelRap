import { generateAnswer } from "../services/gemini.service.js";
import { retrieveTopBars } from "../services/barRetrieval.service.js";


const chatbotController = async (req, res) => {
    try {
        const { question } = req.body;

        if (typeof question !== "string" || question.trim() === "") {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }

        const chunks = await retrieveTopBars(question, 3);
        // console.log(" Check Chunk: ", chunks)
        const answer = await generateAnswer(chunks, question);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfuly!!!",
            message: answer,
            chunks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from service",
        });
    }
};
export {
    chatbotController,
};