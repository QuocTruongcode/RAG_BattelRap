import {
    embedBars,
    embedBattlers,
    embedMatchs,
    fetchBars,
    fetchBattlers,
    fetchMatchs,
} from "../services/chunkBarEmbedding.service.js";
import { saveBarsToVectorDB } from "../services/vectorDB.service.js";

const getItems = (response) => Array.isArray(response) ? response : response?.data;
const isValidItems = (items) =>
    Array.isArray(items) && items.every((item) => typeof item?.text === "string");

const fetchAndEmbedController = async (res, resourceName, fetchItems, embedItems) => {
    try {
        const items = getItems(await fetchItems());
        if (!isValidItems(items)) {
            return res.status(502).json({
                errCode: 1,
                errMessage: `${resourceName} API returned an invalid response`,
            });
        }

        const embeddedItems = await embedItems(items);
        console.log("Check embeddedItems: ", embeddedItems)
        const req = await saveBarsToVectorDB(embeddedItems);
        console.log("Check lenght: ", req)
        return res.status(200).json(embeddedItems);
    } catch (error) {
        console.error(`fetchAndEmbed${resourceName}Controller error:`, error);
        return res.status(502).json({
            errCode: -1,
            errMessage: `Unable to fetch ${resourceName.toLowerCase()} or generate embeddings`,
        });
    }
};

const embedItemsController = async (req, res, resourceName, embedItems) => {
    const items = Array.isArray(req.body)
        ? req.body
        : req.body?.data ?? req.body?.items;

    if (!isValidItems(items)) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Request body must contain an array of items with text fields",
        });
    }

    try {
        const embeddedItems = await embedItems(items);
        await saveBarsToVectorDB(embeddedItems);
        return res.status(200).json(embeddedItems);
    } catch (error) {
        console.error(`embed${resourceName}Controller error:`, error);
        return res.status(500).json({
            errCode: -1,
            errMessage: `Unable to generate ${resourceName.toLowerCase()} embeddings`,
        });
    }
};

export const fetchAndEmbedBarsController = (_req, res) =>
    fetchAndEmbedController(res, "Bars", fetchBars, embedBars);

export const fetchAndEmbedMatchsController = (_req, res) =>
    fetchAndEmbedController(res, "Matchs", fetchMatchs, embedMatchs);

export const fetchAndEmbedBattlersController = (_req, res) =>
    fetchAndEmbedController(res, "Battlers", fetchBattlers, embedBattlers);

export const embedBarsController = (req, res) =>
    embedItemsController(req, res, "Bars", embedBars);

export const embedMatchsController = (req, res) =>
    embedItemsController(req, res, "Matchs", embedMatchs);

export const embedBattlersController = (req, res) =>
    embedItemsController(req, res, "Battlers", embedBattlers);
