import client from "../services/chroma.service.js";

const noEmbedding = { generate: async (texts) => [] };

const testConnection = async () => {
    try {
        const collection = await client.getOrCreateCollection({
            name: "battle_rap_collection",
            embeddingFunction: noEmbedding,
        });

        const result = await collection.get({
            limit: 100,
            include: ["documents", "metadatas"]
        });

        console.log("Total:", result.ids.length);
        console.log("IDs:", result.ids);
        console.log("Documents:", result.documents);
        console.log("Metadatas:", result.metadatas);

    } catch (error) {
        console.log(error);
    }
};

testConnection();