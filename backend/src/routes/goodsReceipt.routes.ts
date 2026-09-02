import { Router } from "express";
import { createGoodsReceipt } from "../controllers/goodsReceipt.controller";

const router = Router();

router.post("/", createGoodsReceipt);

export default router;  