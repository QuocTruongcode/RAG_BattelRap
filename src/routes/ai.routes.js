import express from "express";
import { testAI } from "../controllers/ai.controller.js";
import { queryHandler } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/post-input-question", testAI);
router.post('/query', queryHandler)

export default router;