import { generateAnswer, reQuestion } from "../services/gemini.service.js";
import { retrieveTopBars } from "../services/barRetrieval.service.js";
import { runAgent } from "../services/gemini.service.js";

const chatbotController = async (req, res) => {
    try {
        const { question } = req.body;

        console.log("Check question: ", question)
        if (typeof question !== "string" || question.trim() === "") {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }

        const rephrasedQuestion = await reQuestion(question);

        const output = await runAgent({ message: rephrasedQuestion, user: { role: null } });

        console.log("Check output: ", output)
        // const chunks = await retrieveTopBars(rephrasedQuestion, 3);
        // // console.log(" Check Chunk: ", chunks)
        // const answer = await generateAnswer(chunks, rephrasedQuestion);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfuly!!!",
            message: output.text,
            // chunks: output.chunks,
            action: output.action,
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