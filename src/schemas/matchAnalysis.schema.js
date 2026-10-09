import { z } from "zod";

export const matchAnalysisSchema = z.object({
    match_review: z.object({
        context: z.string().describe("Dựa vào phàn lyrics tôi gử lên, tóm tắt những luận điểm tấn công chính của battler, luận điểm phản đòn(Từng luận điểm là 1 gạch đầu dòng rõ ràng)"),
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
        "Nội dung giải thích ý nghĩa câu rap, viết dưới dạng markdown..."
    ),
    needSearch: z.boolean().describe(
        "true nếu cần tìm kiếm internet để xác thực/bổ sung thông tin, false nếu đã đủ kiến thức."
    ),
    searchQuery: z.string().describe(
        "Câu truy vấn ngắn gọn dùng để tìm kiếm thông tin trên internet. Luôn trả về một câu truy vấn nhắm đến vấn đề quan trọng nhất là câu rap đang nhắc đến sự kiện gì(Ưu tiên số 1 vẫn là sự kiện, đối tượng gì đang được nhắc trong câu rap)"
    ),
    keywords: z.array(z.string()).min(1).max(3).describe(
        "2-3 từ khoá cụ thể dùng để tìm kiếm ảnh/bài viết minh hoạ liên quan qua Serper(lưu ý tôi cần cụm từ khoá đầy đủ đối tượng + thời gian hoặc địa điểm)."
    ),
});

export const matchAnalysisBeefSchema = z.object({
    attack_arguments: z.array(
        z.object({
            attacker: z.string().describe("Người đang tấn công (rapper của bài diss)"),
            target: z.string().describe("Đối tượng bị tấn công (một người hoặc cả nhóm)"),
            argument_type: z.enum([
                "dissing_character",   // công kích nhân cách, đạo đức
                "past_incident",       // lôi lại sự việc/scandal trong quá khứ
                "betrayal_loyalty",    // phản bội, bất trung
                "skill_career",        // công kích kỹ năng, sự nghiệp, độ nổi tiếng
                "territory_status",    // địa bàn, vị thế, danh hiệu
                "family_relationship", // gia đình, người yêu, người liên quan
                "threat_wish_harm",    // đe doạ, nguyền rủa
                "insinuation",         // ám chỉ, nói nước đôi, không nêu tên
                "other",
            ]),
            summary: z.string().describe("Lập luận cụ thể bằng lời của bạn: tấn công điều gì, dựa trên sự kiện/lý lẽ nào"),
            key_lines: z.array(z.string()).describe("Tối đa 1-2 câu ngắn trích từ lyrics làm bằng chứng; mảng rỗng nếu không cần"),
            verifiability: z.enum(["verified", "disputed", "unverified"]).describe("Mức độ xác thực dựa trên chính input (ví dụ comment bảo 'fake fact', người liên quan đã đính chính => disputed). Không tự suy diễn ngoài dữ liệu"),
        })
    ).describe("Các lập luận tấn công đang được triển khai trong bài"),

    counter_arguments: z.array(
        z.object({
            source: z.enum(["in_track", "community"]).describe("in_track: rapper đáp trả/bẻ lại lời đối thủ ngay trong bài; community: người nghe phản biện luận điểm của bài"),
            by: z.string().describe("Rapper hoặc phe cộng đồng (ví dụ: fan bên bị diss, người trung lập)"),
            responding_to: z.string().describe("Lập luận hoặc câu nào đang bị phản đòn"),
            counter_summary: z.string().describe("Nội dung phản đòn"),
            counter_type: z.enum(["twist_lyric", "fact_check", "counter_accusation", "dismiss_motive", "defend_third_party", "other"]),
            effectiveness: z.enum(["strong", "moderate", "weak", "unclear"]).describe("Dựa vào mức đồng tình (likes, phản hồi) trong input"),
        })
    ).describe("Lý lẽ phản đòn. Mảng rỗng nếu input không có"),

    community_reaction: z.object({
        overall_sentiment: z.string().describe("Xu hướng chung: khen/chê/chia phe, kèm lý do"),
        perceived_winner: z.string().describe("Bên được cộng đồng cho là thắng thế, hoặc 'không rõ'"),
        praised_points: z.array(z.string()).describe("Điểm được khen (câu, flow, beat, bẻ lyric...), kèm mức tương tác nếu nổi bật"),
        criticisms: z.array(z.string()).describe("Điểm bị chê (lyrics bẩn, bịa fact, lôi người ngoài cuộc, kỹ thuật...)"),
        controversies: z.array(z.string()).describe("Các tranh cãi chính, phe nào nói gì"),
        top_engaged_comments: z.array(z.string()).describe("Tối đa 3 ý kiến có lượt like cao nhất, tóm tắt ngắn"),
    }),

    overall_situation: z.string().describe("Đánh giá tình thế chung: bài diss gây áp lực ra sao, đối thủ còn phải đáp trả gì, rủi ro (lôi người thứ ba, thông tin chưa xác thực)"),
});