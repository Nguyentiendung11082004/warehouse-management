
import {
    Box, Button,
    IconButton,
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoodsReceipt } from "../types/goodsReceipt";
type Props = {
    handleAddItem: () => void;
    formData: GoodsReceipt;
    handleItemChange: (
        id: number,
        field: keyof GoodsReceiptItem,
        value: string 
    ) => void;
    handleDeleteItem: (id: number) => void;
    totalAmount: number;
};
type GoodsReceiptItem = {
    id: number;
    itemName: string;
    itemCode: string;
    unit: string;
    quantityDocument: number;
    quantityActual: number;
    unitPrice: number;
    totalAmount: number;
};
const GoodsReceiptItemsTable = ({ handleAddItem, formData, handleItemChange, handleDeleteItem, totalAmount }: Props) => {
    const items: GoodsReceiptItem[] = formData?.items;
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 5,
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Danh sách vật tư
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                >
                    Thêm dòng
                </Button>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
                <Table
                    sx={{
                        minWidth: 1000,
                        borderCollapse: "collapse",

                        "& .MuiTableCell-root": {
                            border: "1px solid #333",
                            padding: "8px",
                        },

                        "& .MuiTableCell-head": {
                            fontWeight: 700,
                            textAlign: "center",
                            verticalAlign: "middle",
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{ width: 60 }}
                            >
                                STT
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ minWidth: 200 }}
                            >
                                Tên hàng
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ minWidth: 150 }}
                            >
                                Mã số
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ minWidth: 150 }}
                            >
                                Đơn vị tính
                            </TableCell>

                            <TableCell colSpan={2}>
                                Số lượng
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ minWidth: 150 }}
                            >
                                Đơn giá
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ minWidth: 150 }}
                            >
                                Thành tiền
                            </TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{ width: 70 }}
                            >
                                Thao tác
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell
                                sx={{
                                    minWidth: 150,
                                    textAlign: "center",
                                }}
                            >
                                Theo chứng từ
                            </TableCell>

                            <TableCell
                                sx={{
                                    minWidth: 150,
                                    textAlign: "center",
                                }}
                            >
                                Thực nhập
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {formData.items.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell align="center">
                                    {index + 1}
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        value={item.itemName}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "itemName",
                                                event.target.value
                                            )
                                        }
                                        sx={{
                                            "& .MuiInputLabel-asterisk": {
                                                color: "red",
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={item.itemCode}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "itemCode",
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={item.unit}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "unit",
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={item.quantityDocument}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "quantityDocument",
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={item.quantityActual}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "quantityActual",
                                                event.target.value
                                            )
                                        }
                                        sx={{
                                            "& .MuiInputLabel-asterisk": {
                                                color: "red",
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(event) =>
                                            handleItemChange(
                                                item.id,
                                                "unitPrice",
                                                event.target.value
                                            )
                                        }
                                        sx={{
                                            "& .MuiInputLabel-asterisk": {
                                                color: "red",
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    {item.totalAmount.toLocaleString("vi-VN")}
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell
                                colSpan={4}
                                sx={{
                                    fontWeight: 700,
                                    textAlign: "center",
                                }}
                            >
                                Cộng
                            </TableCell>

                            <TableCell align="center">
                                {items.reduce(
                                    (total: number, item: GoodsReceiptItem) =>
                                        total + Number(item.quantityDocument),
                                    0
                                )}
                            </TableCell>

                            <TableCell align="center">
                                {items.reduce(
                                    (total: number, item: GoodsReceiptItem) =>
                                        total + Number(item.quantityActual),
                                    0
                                )}
                            </TableCell>

                            <TableCell />

                            <TableCell
                                align="right"
                                sx={{ fontWeight: 700 }}
                            >
                                {totalAmount.toLocaleString("vi-VN")}
                            </TableCell>

                            <TableCell />
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
                </Typography>
            </Box>
        </>
    )
}

export default GoodsReceiptItemsTable