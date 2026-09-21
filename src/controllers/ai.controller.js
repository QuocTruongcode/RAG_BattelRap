import { model } from "../services/gemini.service.js";
import { retrieveContext } from '../services/rag.service.js';
import { analyzeMatch } from "../services/gemini.service.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { barExplanationSchema } from "../schemas/matchAnalysis.schema.js";

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

// Model đã ép cấu trúc output theo schema, tạo 1 lần dùng lại nhiều lần
const structuredModel = model.withStructuredOutput(barExplanationSchema);

const testAI = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(500).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }

        const response = await model.invoke(question);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfuly!!!",
            message: response.content,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from service",
        });
    }
};

const analysisBarController = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }

        const response = await structuredModel.invoke([
            new SystemMessage(SYSTEM_PROMPT),
            new HumanMessage(question),
        ]);

        // response đã là object { explanation, keywords } đúng schema
        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfuly!!!",
            message: response,
        });
    } catch (error) {
        console.error("analysisBarController error:", error);

        if (error.status === 429 || error.response?.status === 429) {
            return res.status(429).json({
                errCode: -2,
                errMessage: "Đã hết quota, vui lòng thử lại sau",
            });
        }

        return res.status(500).json({
            errCode: -1,
            errMessage: error.status === 503
                ? "Model tam thoi khong kha dung"
                : "Error from service",
        });
    }
};

const queryHandler = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === '') {
            return res.status(400).json({ error: 'Thiếu câu hỏi' });
        }

        const result = await retrieveContext(question);

        res.json({
            success: true,
            question,
            chunks: result,
        });
    } catch (error) {
        console.error('queryHandler error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const analyzeController = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(500).json({
                errCode: 1,
                errMessage: "Missing input data",
            });
        }

        const result = await analyzeMatch(question);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfully!!!",
            message: result,
        });
    } catch (error) {
        console.error("analyzeController error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: error.status === 503
                ? "Model tam thoi khong kha dung"
                : "Error from service",
        });
    }
};

export {
    testAI, queryHandler, analyzeController, analysisBarController
};