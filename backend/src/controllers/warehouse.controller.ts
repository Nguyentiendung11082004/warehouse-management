import { Request, Response } from "express";
import pool from "../config/database";
export const getWarehouses = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM warehouses ORDER BY id ASC`)
        return res.status(200).json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error("Get warehouses error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get warehouses",
        });
    }
}