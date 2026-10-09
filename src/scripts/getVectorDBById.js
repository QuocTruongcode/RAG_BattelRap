import { collection } from "../services/vectorDB.service.js";

const idArgument = process.argv.find((argument) => argument.startsWith("--id="));
const id = idArgument?.slice("--id=".length);
const showFullVector = process.argv.includes("--full-vector");

if (!id) {
    console.error("Usage: node src/scripts/getVectorDBById.js --id=<id> [--full-vector]");
    process.exitCode = 1;
} else {
    try {
        const result = await collection.get({
            ids: [id],
            include: ["documents", "metadatas", "embeddings"],
        });

        if (result.ids.length === 0) {
            console.log(JSON.stringify({
                collection: "battle_rap_collection_v2",
                found: false,
                id,
            }, null, 2));
        } else {
            const embedding = result.embeddings?.[0] ?? [];

            console.log(JSON.stringify({
                collection: "battle_rap_collection_v2",
                found: true,
                item: {
                    id: result.ids[0],
                    text: result.documents?.[0],
                    metadata: result.metadatas?.[0],
                    vector: showFullVector
                        ? embedding
                        : {
                            dimensions: embedding.length,
                            preview: embedding.slice(0, 10),
                        },
                },
            }, null, 2));
        }
    } catch (error) {
        console.error("Unable to read item from Chroma collection:", error);
        process.exitCode = 1;
    }
}
