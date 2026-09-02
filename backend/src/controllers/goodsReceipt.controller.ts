import { Request, Response } from 'express'
import pool from '../config/database';
export const createGoodsReceipt = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { receiptNumber, receiptDate, unitName, department, senderName, documentNumber,
            documentDate, invoiceNumber, invoiceDate, warehouseId, location, documentType, items,
        } = req.body;
        if (!receiptNumber || !receiptDate || !warehouseId) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin phiếu nhập",
            });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Phiếu nhập phải có ít nhất một mặt hàng",
            });
        }
        if (!Number.isInteger(Number(warehouseId)) || Number(warehouseId) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Kho nhập không hợp lệ",
            });
        }
        for (const item of items) {
            if (!item.itemName || !String(item.itemName).trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Tên hàng không được để trống",
                });
            }

            const quantityActual = Number(item.quantityActual);
            const unitPrice = Number(item.unitPrice);

            if (!Number.isFinite(quantityActual) || quantityActual <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Số lượng thực nhập phải lớn hơn 0",
                });
            }

            if (!Number.isFinite(unitPrice) || unitPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Đơn giá không hợp lệ",
                });
            }
        }

        await client.query("BEGIN");
        const receiptResult = await client.query(
            `INSERT INTO goods_receipts (receipt_number,receipt_date,unit_name,department,sender_name,document_number,
                document_date,invoice_number,invoice_date,warehouse_id,location,document_type
              )
              VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11, $12
              )
              RETURNING id`,
            [receiptNumber, receiptDate, unitName, department, senderName, documentNumber, documentDate || null, invoiceNumber, invoiceDate || null, warehouseId, location, documentType,]
        );
        const receiptId = receiptResult.rows[0].id;
        for (const item of items) {
            const totalAmount =
                Number(item.quantityActual) * Number(item.unitPrice);
            await client.query(
                `
                INSERT INTO goods_receipt_items (receipt_id,item_name,item_code,unit,quantity_document,quantity_actual,unit_price,total_amount
                )
                VALUES (
                  $1, $2, $3, $4,
                  $5, $6, $7, $8
                )
              `,
                [receiptId, item.itemName, item.itemCode || null, item.unit || null, item.quantityDocument || 0,
                    item.quantityActual, item.unitPrice || 0, totalAmount,
                ]
            );
        }
        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Tạo phiếu nhập thành công",
            data: {
                id: receiptId,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể tạo phiếu nhập",
        });
    } finally {
        client.release();
    }
}