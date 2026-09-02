import { createGoodsReceipt } from "./goodsReceipt.controller";
import pool from "../config/database";

jest.mock("../config/database", () => ({
    __esModule: true,
    default: {
        connect: jest.fn(),
    },
}));

describe("createGoodsReceipt", () => {
    let mockReq: any;
    let mockRes: any;
    let mockClient: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {},
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        (pool.connect as jest.Mock).mockResolvedValue(mockClient);
    });

    test("returns 400 when required fields are missing", async () => {
        mockReq.body = {
            receiptDate: "2026-09-08",
            warehouseId: 1,
            items: [],
        };

        await createGoodsReceipt(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin phiếu nhập",
        });
    });

    test("returns 400 when items are empty", async () => {
        mockReq.body = {
            receiptNumber: "PN001",
            receiptDate: "2026-09-08",
            warehouseId: 1,
            items: [],
        };

        await createGoodsReceipt(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Phiếu nhập phải có ít nhất một mặt hàng",
        });
    });

    test("returns 400 when warehouseId is invalid", async () => {
        mockReq.body = {
            receiptNumber: "PN001",
            receiptDate: "2026-09-08",
            warehouseId: "abc",
            items: [
                {
                    itemName: "Sản phẩm A",
                    quantityActual: 10,
                    unitPrice: 50000,
                },
            ],
        };

        await createGoodsReceipt(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Kho nhập không hợp lệ",
        });
    });

    test("returns 400 when item data is invalid", async () => {
        mockReq.body = {
            receiptNumber: "PN001",
            receiptDate: "2026-09-08",
            warehouseId: 1,
            items: [
                {
                    itemName: "",
                    quantityActual: 0,
                    unitPrice: -100,
                },
            ],
        };

        await createGoodsReceipt(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Tên hàng không được để trống",
        });
    });

    test("creates goods receipt successfully", async () => {
        mockReq.body = {
            receiptNumber: "PN001",
            receiptDate: "2026-09-08",
            unitName: "Công ty ABC",
            department: "Kho",
            senderName: "Nguyễn Văn A",
            documentNumber: "CT001",
            documentDate: "2026-09-08",
            invoiceNumber: "HD001",
            invoiceDate: "2026-09-08",
            warehouseId: 1,
            location: "Hà Nội",
            documentType: "Hóa đơn",
            items: [
                {
                    itemName: "Sản phẩm A",
                    itemCode: "SP001",
                    unit: "Cái",
                    quantityDocument: 10,
                    quantityActual: 10,
                    unitPrice: 50000,
                },
            ],
        };

        mockClient.query
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce({
                rows: [{ id: 1 }],
            })
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        await createGoodsReceipt(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            message: "Tạo phiếu nhập thành công",
            data: {
                id: 1,
            },
        });
        expect(mockClient.release).toHaveBeenCalled();
    });
});