// ExtentionTool/navigateTo.js
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { retrieveTopBars } from "../services/barRetrieval.service.js"
const PAGES = {
    home: { description: "Trang chủ, danh sách video và nội dung nổi bật", aliases: ["trang chính", "màn hình chính"], roles: null },
    chatbot: { description: "Trang trò chuyện toàn màn hình với chatbot", aliases: ["trang chat", "trang hỏi đáp"], roles: null },
    videoCrud: { description: "Trang admin thêm, sửa, xóa video. Không phải trang xem video", aliases: ["thêm video", "upload video"], roles: ["U0"] },
    dramaCrud: { description: "Trang admin thêm, sửa, xóa drama", aliases: ["thêm drama", "sửa drama"], roles: ["U0"] },
    // ...các trang còn lại
    // watch: { description: "Trang xem 1 video trận đấu cụ thể", aliases: ["xem video", "video", "xem chi tiết một trận đấu"], roles: null },
}

const allowedPages = (role) =>
    Object.entries(PAGES).filter(([, p]) => !p.roles || p.roles.includes(role))

export const buildNavigateTool = (ctx, user) => {
    const allowed = allowedPages(user?.role)
    const keys = allowed.map(([key]) => key)

    return tool(
        async ({ page }) => {
            // kiểm tra lại quyền, kể cả khi model chọn sai
            if (!keys.includes(page)) {
                return "Trang không tồn tại hoặc người dùng không có quyền."
            }
            ctx.action = { type: "NAVIGATE", target: page, params: {} }
            ctx.finalReply = "Mình đã chuyển trang cho bạn nhé!"
            return "Đã yêu cầu chuyển trang."
        },
        {
            name: "navigate_to",
            description:
                "Chuyển người dùng đến một trang của website. " +
                "Không dùng để mở một video cụ thể hay trả lời câu hỏi thông tin.",
            schema: z.object({
                page: z
                    .enum(keys)
                    .describe(
                        allowed
                            .map(([key, p]) => `${key}: ${p.description}. Người dùng có thể gọi là: ${p.aliases.join(", ")}`)
                            .join("\n")
                    ),
            }),
        }
    )
}

export const buildOpenVideoTool = (ctx) =>
    tool(
        async ({ query }) => {
            const chunks = await retrieveTopBars(query, 3)
            console.log("Check chunks: ", chunks)

            // Duyệt lần lượt từ chunk đầu đến chunk cuối, lấy videoId của chunk đầu tiên có giá trị
            let videoId = null
            for (const chunk of chunks ?? []) {
                const id = chunk?.metadata?.videoID || chunk?.metadata?.match_id
                if (id) {
                    videoId = id
                    break
                }
            }

            if (!videoId) {
                ctx.finalReply = "Mình chưa tìm thấy video phù hợp. Bạn nói rõ hơn tên trận hoặc tuyển thủ giúp mình nhé!"
                return "Không tìm thấy video phù hợp"
            }

            ctx.action = { type: "NAVIGATE", target: "watch", params: { videoId } }
            ctx.finalReply = "Mình đã mở video cho bạn nhé!"
            return `Đã yêu cầu mở video ${videoId}.`
        },
        {
            name: "open_video",
            description:
                "Mở trang xem một video trận đấu theo mô tả của người dùng " +
                "(tên trận, đội, tuyển thủ, nội dung...). Hệ thống tự tìm video phù hợp nhất.",
            schema: z.object({
                query: z.string().describe("Mô tả video cần mở, lấy từ lời người dùng"),
            }),
        }
    )