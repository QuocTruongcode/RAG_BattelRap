import { collection } from "../services/vectorDB.service.js";

const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
const limit = limitArgument ? Number(limitArgument.split("=")[1]) : 20;
const showFullVectors = process.argv.includes("--full-vectors");

if (!Number.isInteger(limit) || limit < 1) {
    console.error("--limit must be a positive integer");
    process.exitCode = 1;
} else {
    try {
        const total = await collection.count();
        const result = await collection.get({
            limit,
            include: ["documents", "metadatas", "embeddings"],
        });

        const records = result.ids.map((id, index) => {
            const embedding = result.embeddings?.[index] ?? [];

            return {
                id,
                text: result.documents?.[index],
                metadata: result.metadatas?.[index],
                vector: showFullVectors
                    ? embedding
                    : {
                        dimensions: embedding.length,
                        preview: embedding.slice(0, 10),
                    },
            };
        });

        console.log(JSON.stringify({
            collection: "battle_rap_collection_v2",
            total,
            returned: records.length,
            records,
        }, null, 2));
    } catch (error) {
        console.error("Unable to read Chroma collection:", error);
        process.exitCode = 1;
    }
}