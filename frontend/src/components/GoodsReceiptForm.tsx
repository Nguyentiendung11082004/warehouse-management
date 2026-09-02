import { useEffect, useState } from "react";
import {
    Box, Button, CircularProgress, Container,
    MenuItem, Paper,
    TextField, Typography
} from "@mui/material";
import toast from "react-hot-toast";
import { createGoodsReceipt, getWarehouses } from "../api/goodsReceipt.api";
import type {
    GoodsReceipt,
    GoodsReceiptItem,
} from "../types/goodsReceipt";
import GoodsReceiptItemsTable from "./GoodsReceiptItemsTable";
const createEmptyItem = (): GoodsReceiptItem => ({
    id: Date.now(),
    itemName: "",
    itemCode: "",
    unit: "",
    quantityDocument: 0,
    quantityActual: 0,
    unitPrice: 0,
    totalAmount: 0,
});
export default function GoodsReceiptForm() {
    const [formData, setFormData] = useState<GoodsReceipt>({
        receiptNumber: "",
        receiptDate: "",
        unitName: "",
        department: "",
        senderName: "",
        documentNumber: "",
        documentDate: "",
        invoiceNumber: "",
        invoiceDate: "",
        warehouseId: "",
        location: "",
        documentType: "",
        items: [createEmptyItem()],
    });
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (id: number, field: keyof GoodsReceiptItem, value: string) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item) => {
                if (item.id !== id) return item;

                const updatedItem = {
                    ...item,
                    [field]: field === "itemName" || field === "itemCode" || field === "unit"
                        ? value
                        : Number(value),
                };
                if (field === "quantityActual" || field === "unitPrice") {
                    updatedItem.totalAmount =
                        Number(updatedItem.quantityActual) *
                        Number(updatedItem.unitPrice);
                }
                return updatedItem;
            }),
        }));
    };

    const handleAddItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, createEmptyItem()],
        }));
    };

    const handleDeleteItem = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter(
                (item) => item.id !== id
            ),
        }));
    };

    const totalAmount = formData.items.reduce(
        (total, item) => total + item.totalAmount,
        0
    );

    const handleSubmit = async () => {
        if (!formData.receiptNumber.trim()) {
            toast.error("Vui lòng nhập số phiếu");
            return;
        }
        if (!formData.receiptDate) {
            toast.error("Vui lòng chọn ngày nhập");
            return;
        }

        if (!formData.warehouseId) {
            toast.error("Vui lòng chọn kho nhập");
            return;
        }

        if (!formData.items || formData.items.length === 0) {
            toast.error("Phiếu nhập phải có ít nhất một mặt hàng");
            return;
        }
        const invalidItem = formData.items.find(
            (item) =>
                !item.itemName.trim() ||
                Number(item.quantityActual) <= 0 ||
                Number(item.unitPrice) < 0
        );

        if (invalidItem) {
            toast.error(
                "Vui lòng kiểm tra tên hàng, số lượng thực nhập và đơn giá"
            );
            return;
        }
        try {
            setLoading(true);
            const pay = {
                ...formData,
                totalAmount,
            };
            await createGoodsReceipt(pay)
            toast.success("Tạo phiếu nhập thành công");
        } catch (error) {
            console.error("Create goods receipt error:", error);
            toast.error("Không thể tạo phiếu nhập");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const getListWarehouses = async () => {
            const res = await getWarehouses()
            setWarehouses(res.data.data);
        };

        getListWarehouses();
    }, []);
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        mb: 4,
                    }}
                >
                    PHIẾU NHẬP KHO
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    Thông tin phiếu nhập
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                        },
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Đơn vị"
                        name="unitName"
                        value={formData.unitName}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        label="Bộ phận"
                        name="department"
                        value={formData.department}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        required
                        label="Số phiếu"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleFormChange}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-asterisk": {
                                color: "red",
                            },
                        }}
                    />

                    <TextField
                        required
                        label="Ngày nhập"
                        name="receiptDate"
                        type="date"
                        value={formData.receiptDate}
                        onChange={handleFormChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-asterisk": {
                                color: "red",
                            },
                        }}
                    />

                    <TextField
                        label="Người giao"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        select
                        required
                        label="Kho nhập"
                        name="warehouseId"
                        value={formData.warehouseId}
                        onChange={handleFormChange}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-asterisk": {
                                color: "red",
                            },
                        }}
                    >
                        {warehouses.map((warehouse: any) => (
                            <MenuItem
                                key={warehouse.id}
                                value={warehouse.id}
                            >
                                {warehouse.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Địa điểm nhập"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        label="Loại chứng từ"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        label="Số chứng từ"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        label="Ngày chứng từ"
                        name="documentDate"
                        type="date"
                        value={formData.documentDate}
                        onChange={handleFormChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Số hóa đơn"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleFormChange}
                        fullWidth
                    />

                    <TextField
                        label="Ngày hóa đơn"
                        name="invoiceDate"
                        type="date"
                        value={formData.invoiceDate}
                        onChange={handleFormChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                    />
                </Box>

                <GoodsReceiptItemsTable
                    handleAddItem={handleAddItem}
                    formData={formData}
                    handleItemChange={handleItemChange}
                    handleDeleteItem={handleDeleteItem}
                    totalAmount={totalAmount}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={18} color="inherit" /> : null
                        }
                    >
                        {loading ? "Đang lưu..." : "Lưu phiếu nhập"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}