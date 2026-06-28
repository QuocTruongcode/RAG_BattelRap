import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
});

const noEmbedding = { generate: async (texts) => [] };

export const collection = await client.getOrCreateCollection({
    name: "battle_rap_collection",
    embeddingFunction: noEmbedding,

});

export const saveToChroma = async (arrayData) => {
    try {
        await collection.add({
            ids: arrayData.map(x => x.id),
            embeddings: arrayData.map(x => x.embedding),
            documents: arrayData.map(x => x.document),
            metadatas: arrayData.map(x => ({
                ...x.metadata,
                loc: JSON.stringify(x.metadata.loc) // chuyển object thành string
            }))
        });
        console.log("save thanh cong");
    } catch (e) {
        console.log("save khong thanh cong", e.message);
    }
};
// Thêm vào file chroma.service.js hiện có của bạn

// ✅ Dùng thẳng collection đã có
export const queryCollection = async (vector, topK = 3) => {
    const results = await collection.query({
        queryEmbeddings: [vector],
        nResults: topK,
    })

    return results.documents[0].map((doc, i) => ({
        content: doc,
        distance: results.distances[0][i],
        metadata: results.metadatas[0][i],
    }))
}

export default client;