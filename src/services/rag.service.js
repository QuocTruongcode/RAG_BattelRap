import { embeddingChunk }
    from "./embedding.service.js";

import { saveToChroma }
    from "./chroma.service.js";
import { embeddingText } from './embedding.service.js'
import { queryCollection } from './chroma.service.js'
import { generateAnswer } from './gemini.service.js'


export const indexDocuments = async () => {

    try {
        const arrayData =
            await embeddingChunk();

        await saveToChroma(arrayData);

        console.log("Index thành công");

    } catch (e) {
        console.log("save khong thanh cong", e.message);
    }

};
export const retrieveContext = async (question) => {
    // Bước 21: Embed câu hỏi → vector
    const questionVector = await embeddingText(question)

    // Bước 22-23: Semantic search → top 3 chunk
    const chunks = await queryCollection(questionVector, 3)

    const result = await generateAnswer(chunks, question)

    return result;
}
//test
