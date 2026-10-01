import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
});

const battlerRapDBVector = { generate: async (texts) => [] };

export const collection = await client.getOrCreateCollection({
    name: "battle_rap_collection_v2",
    embeddingFunction: battlerRapDBVector,
    metadata: { "hnsw:space": "cosine" },

});

export const saveBarsToVectorDB = async (bars) => {
    if (!Array.isArray(bars)) {
        throw new TypeError("bars must be an array");
    }

    if (bars.length === 0) {
        return { saved: 0 };
    }

    if (bars.some((bar) => !bar.chunkID || typeof bar.text !== "string" || !Array.isArray(bar.vector))) {
        throw new TypeError("Each bar must have chunkID, text, and vector fields");
    }

    await collection.upsert({
        ids: bars.map((bar) => String(bar.chunkID)),
        embeddings: bars.map((bar) => bar.vector),
        documents: bars.map((bar) => bar.text),
        metadatas: bars.map((bar) => bar.metadata ?? {}),
    });

    return { saved: bars.length };
};

export default client;