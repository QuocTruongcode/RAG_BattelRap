import express from "express";
import { testAI } from "../controllers/ai.controller.js";
import { queryHandler } from "../controllers/ai.controller.js";
import { indexDocumentsHandler } from "../controllers/loadDocumentController.js";

const router = express.Router();

router.post("/post-input-question", testAI);
router.post('/query', queryHandler)
router.post("/index-documents", indexDocumentsHandler);

export default router;