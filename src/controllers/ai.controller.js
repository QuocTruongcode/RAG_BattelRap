import { model } from "../services/gemini.service.js";
import { retrieveContext } from '../services/rag.service.js'

const testAI = async (req, res) => {
    try {
        const question = req.body.message;

        if (!question) {
            return res.status(500).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }
        else {
            const response = await model.invoke(question);

            return res.status(200).json({
                errCode: 0,
                errMessage: "Get answer successfuly!!!",
                message: response.content,
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from service",
        });
    }
};

const queryHandler = async (req, res) => {
    try {
        const { question } = req.body

        // Validate input
        if (!question || question.trim() === '') {
            return res.status(400).json({ error: 'Thiếu câu hỏi' })
        }

        // Gọi RAG service
        const result = await retrieveContext(question)

        res.json({
            success: true,
            question,
            chunks: result   // top 3 chunk từ ChromaDB
        })

    } catch (error) {
        console.error('queryHandler error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export {
    testAI, queryHandler
}