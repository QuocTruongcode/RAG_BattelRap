import axios from "axios";
import { embeddingText } from "./embedding.service.js";
const EMBEDDING_BATCH_SIZE = 5;

const fetchChunks = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

export const fetchBars = () => fetchChunks(
    process.env.CHUNK_BARS_API_URL ?? "http://localhost:3001/api/chunks/bars"
);
export const fetchMatchs = () => fetchChunks(
    process.env.CHUNK_MATCHS_API_URL ?? "http://localhost:3001/api/chunks/videos"
);
export const fetchBattlers = () => fetchChunks(
    process.env.CHUNK_BATTLERS_API_URL ?? "http://localhost:3001/api/chunks/battlers"
);

export const embedBars = async (bars) => {
    const embeddedBars = [];

    for (let index = 0; index < bars.length; index += EMBEDDING_BATCH_SIZE) {
        const batch = bars.slice(index, index + EMBEDDING_BATCH_SIZE);
        const embeddedBatch = await Promise.all(
            batch.map(async (bar) => ({
                ...bar,
                vector: await embeddingText(bar.text),
            }))
        );

        // const req = await saveBarsToVectorDB(embeddedBatch)
        // console.log("Check req saveBarsToVectorDBs: ", req)
        embeddedBars.push(...embeddedBatch);
    }

    return embeddedBars;
};

export const embedMatchs = (matchs) => embedBars(matchs);
export const embedBattlers = (battlers) => embedBars(battlers);