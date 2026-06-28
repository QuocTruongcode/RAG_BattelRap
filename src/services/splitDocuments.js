import { RecursiveCharacterTextSplitter }
    from "langchain/text_splitter";

import { loadDocuments }
    from "./loadDocuments.js";

export const splitDocuments = async () => {

    // Load documents
    const docs = await loadDocuments();

    let finalChunks = [];

    // Recursive splitter
    const recursiveSplitter =
        new RecursiveCharacterTextSplitter({

            chunkSize: 800,
            chunkOverlap: 150,
        });

    // Loop từng document
    for (const doc of docs) {

        const text = doc.pageContent;

        // =========================
        // STRUCTURE CHUNKING
        // Split theo ###
        // =========================

        const sections = text.split(/\n### /);

        // Loop từng section
        for (let i = 0; i < sections.length; i++) {

            let section = sections[i];

            // thêm lại ### nếu bị mất
            if (i !== 0) {

                section = "### " + section;
            }

            // =========================
            // RECURSIVE CHUNKING
            // =========================

            const chunks =
                await recursiveSplitter.createDocuments(
                    [section],
                    [doc.metadata]
                );

            finalChunks.push(...chunks);
        }
    }

    console.log(
        "✅ Total chunks:",
        finalChunks.length
    );

    // TEST OUTPUT
    // console.log("\n========== CHUNKS ==========\n");

    // finalChunks.forEach((chunk, index) => {

    //     console.log(`Chunk ${index + 1}\n`);

    //     console.log(chunk.pageContent);

    //     console.log("\n-------------------\n");
    // });

    return finalChunks;
};

