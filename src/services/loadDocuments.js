import fs from "fs";
import path from "path";

// LangChain loaders (version mới ổn định hơn)
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

/**
 * Load toàn bộ documents từ thư mục src/data
 */
export const loadDocuments = async () => {
    const folderPath = "src/data";

    // lấy danh sách file trong folder
    const files = fs.readdirSync(folderPath);

    let allDocs = [];

    for (const file of files) {
        const filePath = path.join(folderPath, file);

        let loader = null;

        // TXT
        if (file.endsWith(".txt")) {
            loader = new TextLoader(filePath);
        }

        // Markdown
        else if (file.endsWith(".md")) {
            loader = new TextLoader(filePath);
        }

        // PDF
        else if (file.endsWith(".pdf")) {
            loader = new PDFLoader(filePath);
        }

        // DOCX
        else if (file.endsWith(".docx")) {
            loader = new DocxLoader(filePath);
        }

        // file không hỗ trợ
        else {
            console.log(`⚠️ Skip unsupported file: ${file}`);
            continue;
        }

        try {
            const docs = await loader.load();
            allDocs.push(...docs);

        } catch (err) {
            console.log(`❌ Error loading file ${file}:`, err.message);
        }
    }

    console.log("✅ Total documents loaded:", allDocs.length);

    return allDocs;
};