import { indexDocuments } from "../services/rag.service.js";

export const indexDocumentsHandler = async (req, res) => {
    try {
        await indexDocuments();

        return res.status(200).json({
            success: true,
            message: "Documents indexed successfully",
        });
    } catch (error) {
        console.error("indexDocumentsHandler error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to index documents",
        });
    }
};
