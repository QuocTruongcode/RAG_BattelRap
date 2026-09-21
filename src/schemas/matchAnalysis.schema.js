import { z } from "zod";

export const matchAnalysisSchema = z.object({
    match_review: z.object({
        context: z.string().describe("Bối cảnh trận đấu: sự kiện, giải đấu, lý do diễn ra, bối cảnh giữa hai bên"),
        general_assessment: z.string().describe("Đánh giá chung về chất lượng, diễn biến tổng thể của trận đấu, khán giả đánh giá ai cao hơn"),
        community_reaction: z.string().describe("Phản ứng, nhận xét của cộng đồng/khán giả về trận đấu"),
    }),
    battler_reviews: z.array(
        z.object({
            battler_name: z.string().describe("Tên của battler"),
            review_text: z.string().describe("Nhận xét, đánh giá về battler trong trận đấu, có thắng trận này không, các vấn đề khác"),
        })
    ).describe("Danh sách review cho từng battler, số lượng tùy theo trận đấu"),
});

export const barExplanationSchema = z.object({
    explanation: z.string().describe(
        "Nội dung giải thích ý nghĩa câu rap, viết dưới dạng markdown (có thể dùng heading, in đậm, danh sách nếu cần), giải thích rõ chơi chữ, ẩn ý, ngữ cảnh liên quan"
    ),
    keywords: z.array(z.string()).min(1).max(3).describe(
        "2-3 từ khoá cụ thể (tên sự kiện, tên người, địa danh, thuật ngữ văn hoá được nhắc tới trong câu rap) dùng để tìm kiếm ảnh/bài viết minh hoạ liên quan. Không dùng từ khoá chung chung."
    ),
});