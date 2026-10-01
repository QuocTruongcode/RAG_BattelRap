import { model, modelWithSearch } from "../services/gemini.service.js";
import { retrieveContext } from '../services/rag.service.js';
import { analyzeMatch } from "../services/gemini.service.js";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { barExplanationSchema } from "../schemas/matchAnalysis.schema.js";
import { tavilySearchTool } from "../ExtentionTool/tavilySearchTool.js";
import { SYSTEM_PROMPT } from "../constants/prompts.js"; // nhớ đuôi .js vì project dùng ESM
import { searchImages } from "../ExtentionTool/searchImage.js"
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

        // Lần gọi 1: model phân tích + tự quyết định needSearch theo schema
        const draft = await structuredModel.invoke([
            new SystemMessage(SYSTEM_PROMPT),
            new HumanMessage(question),
        ]);

        console.log("Check draft LLM 1: ", draft);

        const results = await Promise.allSettled(
            draft.keywords.map((keyword) => searchImages({ query: keyword }))
        );

        const images = results.map((result, i) => {
            if (result.status === "fulfilled") {
                return { keyword: draft.keywords[i], data: result.value };
            }
            console.error(`Search failed for "${draft.keywords[i]}":`, result.reason?.message);
            return { keyword: draft.keywords[i], data: null, error: result.reason?.message };
        });


        const cleanedImages = images
            .filter((r) => r.data?.images?.length)
            .map((r) => {
                const img = r.data.images[0];
                return {
                    keyword: r.keyword,
                    title: img.title,
                    imageUrl: img.imageUrl,
                    thumbnailUrl: img.thumbnailUrl,
                    link: img.link,
                };
            });

        console.log("Check cleanedImages: ", cleanedImages);
        let finalExplanation = draft.explanation;

        if (draft.needSearch && draft.searchQuery?.trim() !== "") {
            const searchResult = await tavilySearchTool.invoke({ query: draft.searchQuery });
            console.log(" ChecksearchResult: ", searchResult)
            // Lần gọi 2: model thường (không cần structured), đọc context search rồi hoàn thiện câu trả lời
            const finalResponse = await model.invoke([
                new SystemMessage(SYSTEM_PROMPT),
                new HumanMessage(question),
                new AIMessage(`Giải thích sơ bộ: ${draft.explanation}`),
                new HumanMessage(
                    `Đây là thông tin tìm kiếm được từ internet:\n${searchResult}\n\nHãy hoàn thiện lại phần giải thích dựa trên thông tin này, sửa lại nếu bản sơ bộ có sai sót.`
                ),
            ]);

            finalExplanation = finalResponse.content;
        }

        console.log("Check finalExplanation: ", finalExplanation)

        return res.status(200).json({
            errCode: 0,
            errMessage: "Get answer successfuly!!!",
            message: {
                explanation: finalExplanation,
                usedSearch: draft.needSearch,
                searchQuery: draft.searchQuery,
                keywords: draft.keywords, // dùng cho Serper tìm ảnh
                cleanedImages: cleanedImages,

            },
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