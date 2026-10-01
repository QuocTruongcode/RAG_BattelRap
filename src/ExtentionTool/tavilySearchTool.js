import axios from "axios";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const tavilySearchTool = tool(
    async ({ query }) => {
        try {
            const response = await axios.post(
                `${process.env.BACKEND_URL}/api/search-tavily`,
                { message: query }
            );
            console.log("Check response tavilySearchTool : ", response.data.data)
            return response.data.data.answer; // lấy context đã format sẵn
        } catch (error) {
            console.error("tavilySearchTool HTTP error:", error);
            return "Không thể tìm kiếm thông tin lúc này.";
        }
    },
    {
        name: "search_internet",
        description:
            "Tìm kiếm thông tin mới nhất trên internet khi context hiện tại không đủ để trả lời câu hỏi.",
        schema: z.object({
            query: z.string().describe("Từ khóa hoặc câu hỏi cần tìm kiếm trên internet"),
        }),
    }
);