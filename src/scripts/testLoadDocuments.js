import { loadDocuments } from "../services/loadDocuments.js";

const run = async () => {
    const docs = await loadDocuments();

    console.log("========== RESULT ==========");

    docs.forEach((doc, index) => {
        console.log(`\nDocument ${index + 1}`);
        console.log("Content:", doc.pageContent);
        console.log("Metadata:", doc.metadata);
    });
};

run();