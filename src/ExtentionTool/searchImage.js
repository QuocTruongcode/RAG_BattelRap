import axios from "axios";

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_IMAGE_URL = process.env.SERPER_IMAGE_URL;

export const searchImages = async ({ query, num = 1, page = 1 }) => {
    if (!SERPER_API_KEY) {
        throw new Error("Missing SERPER_API_KEY in environment variables");
    }

    if (!SERPER_IMAGE_URL) {
        throw new Error("Missing SERPER_IMAGE_URL in environment variables");
    }

    try {
        const response = await axios.post(
            SERPER_IMAGE_URL,
            {
                q: query,
                num,
                page,
            },
            {
                headers: {
                    "X-API-KEY": SERPER_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("========== SERPER IMAGE ERROR ==========");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("URL:", error.config?.url);
        console.error("Request data:", error.config?.data);
        console.error("========================================");

        throw error;
    };


};