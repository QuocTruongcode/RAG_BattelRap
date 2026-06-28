import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GOOGLE_API_KEY,
});

const generateAnswer = async (chunks, question) => {
    const context = chunks
        .map((chunk, i) => `[Nguồn ${i + 1}]:\n${chunk.content}`)
        .join("\n\n");

    const systemPrompt = `
Bạn là chuyên gia về rap Việt Nam.
Chỉ trả lời dựa trên thông tin được cung cấp.
Nếu không có thông tin, hãy nói thẳng là không biết.
Trả lời bằng tiếng Việt, ngắn gọn và chính xác.
    `.trim();

    const userMessage = `
Dưới đây là thông tin liên quan từ cơ sở dữ liệu:

--- CONTEXT BẮT ĐẦU ---
${context}
--- CONTEXT KẾT THÚC ---

Câu hỏi: ${question}

Lưu ý: Chỉ dùng thông tin trong CONTEXT, không bịa đặt.
    `.trim();

    const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage),
    ]);

    return response.content;
};

export { model, generateAnswer };