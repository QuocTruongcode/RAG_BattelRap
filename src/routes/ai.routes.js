import express from "express";
import { testAI } from "../controllers/ai.controller.js";
import { queryHandler, analyzeController, analysisBarController } from "../controllers/ai.controller.js";
import { indexDocumentsHandler } from "../controllers/loadDocumentController.js";
import { chatbotController } from "../controllers/chatbotController.js"
import {
    embedBarsController,
    embedBattlersController,
    embedMatchsController,
    fetchAndEmbedBarsController,
    fetchAndEmbedBattlersController,
    fetchAndEmbedMatchsController,
} from "../controllers/chunkBarContextController.js";
const router = express.Router();

router.post("/post-input-question", testAI);
router.post('/query', queryHandler)
// router AI review match analysis and battler reviews
router.post('/analysis', analyzeController)
// router phân tích bar
router.post("/analysis-bar", analysisBarController);
router.post("/api/chunks/bars/embed", embedBarsController);
router.get("/api/chunks/bars/embedded", fetchAndEmbedBarsController);
router.post("/api/chunks/matchs/embed", embedMatchsController);
router.get("/api/chunks/matchs/embedded", fetchAndEmbedMatchsController);
router.post("/api/chunks/battlers/embed", embedBattlersController);
router.get("/api/chunks/battlers/embedded", fetchAndEmbedBattlersController);

// router chat bot
router.post("/api/chatbot", chatbotController);

// phân tích document
router.post("/index-documents", indexDocumentsHandler);

export default router;