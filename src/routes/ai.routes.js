import express from "express";
import { testAI } from "../controllers/ai.controller.js";
import { queryHandler, analyzeController, analysisBarController } from "../controllers/ai.controller.js";
import { indexDocumentsHandler } from "../controllers/loadDocumentController.js";

const router = express.Router();

router.post("/post-input-question", testAI);
router.post('/query', queryHandler)
// router AI review match analysis and battler reviews
router.post('/analysis', analyzeController)
// router phân tích bar
router.post("/analysis-bar", analysisBarController);

router.post("/index-documents", indexDocumentsHandler);

export default router;