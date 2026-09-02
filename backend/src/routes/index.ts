import { Router } from "express";
import warehouseRoutes from "./warehouse.routes";
import goodsReceiptRoutes from "./goodsReceipt.routes";

const router = Router();

router.use("/warehouses", warehouseRoutes);
router.use("/goods-receipts", goodsReceiptRoutes);

export default router;