import { GoogleGenAI } from "@google/genai";
import { splitDocuments } from "./splitDocuments.js";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const chunks = await splitDocuments();
// console.log("Check chunk: ", chunks);

export const embeddingText = async (text) => {

    try {

        const result =
            await ai.models.embedContent({
                model: "gemini-embedding-001",
                contents: text,
            });

        return result.embeddings[0].values;

    } catch (error) {

        console.log(error);

    }
};

export const embeddingChunk = async () => {

    const arrayData = [];
    for (let i = 0; i < chunks.length; i++) {

        const vector = await embeddingText(chunks[i].pageContent);
        const itemObject = {
            id: `diss12_chunk_${i + 1}`,
            embedding: vector,
            document: chunks[i].pageContent,
            metadata: chunks[i].metadata

        };
        arrayData.push(itemObject);
        await new Promise(resolve => setTimeout(resolve, 1000));

    }

    console.log("Check array data: ", arrayData);
    return arrayData;
};


