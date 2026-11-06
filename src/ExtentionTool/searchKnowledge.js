// ExtentionTool/searchKnowledge.js
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { retrieveTopBars } from "../services/barRetrieval.service.js"   // chỉnh đường dẫn cho đúng

export const buildSearchTool = (ctx) =>
    tool(
        async ({ query }) => {
            try {
                const chunks = await retrieveTopBars(query, 3)
                ctx.chunks.push(...chunks)                       // để controller trả chunks cho FE như cũ

                if (chunks.length === 0) {
                    return "Không tìm thấy thông tin liên quan trong cơ sở dữ liệu."
                }

                const context = chunks
                    .map((chunk, i) => `[Nguồn ${i + 1}]:\n${chunk.content}`)
                    .join("\n\n")

                return `
Dưới đây là thông tin liên quan từ cơ sở dữ liệu:

--- CONTEXT BẮT ĐẦU ---
${context}
--- CONTEXT KẾT THÚC ---

Lưu ý: Chỉ dùng thông tin trong CONTEXT, không bịa đặt.
        `.trim()
            } catch (err) {
                console.error("search_knowledge error:", err)
                return "Tìm kiếm gặp lỗi, hãy báo người dùng thử lại sau."
            }
        },
        {
            name: "search_knowledge",
            description:
                "Tìm thông tin về battle rap, battler, drama, video trong cơ sở dữ liệu để trả lời câu hỏi. " +
                "Dùng cho mọi câu hỏi thông tin. Không dùng cho yêu cầu chuyển/mở trang.",
            schema: z.object({
                query: z
                    .string()
                    .describe("Câu hỏi đầy đủ, tự đứng một mình (thay đại từ bằng tên cụ thể), giữ nguyên ý người dùng"),
            }),
        }
    )