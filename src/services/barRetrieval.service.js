import { embeddingText } from "./embedding.service.js";
import { collection } from "./vectorDB.service.js";

export const retrieveTopBars = async (question, topK = 3) => {
    if (typeof question !== "string" || question.trim() === "") {
        throw new TypeError("question must be a non-empty string");
    }

    const questionVector = await embeddingText(question);
    const results = await collection.query({
        queryEmbeddings: [questionVector],
        nResults: topK,
        include: ["documents", "metadatas", "distances"],
    });

    return (results.ids?.[0] ?? []).map((id, index) => ({
        id,
        content: results.documents?.[0]?.[index] ?? "",
        distance: results.distances?.[0]?.[index] ?? null,
        metadata: results.metadatas?.[0]?.[index] ?? {},
    }));
};