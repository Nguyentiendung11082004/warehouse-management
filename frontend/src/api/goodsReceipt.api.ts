import axiosClient from "./axios";

export const getWarehouses = () => {
    return axiosClient.get("/warehouses");
};

export const createGoodsReceipt = (data: any) => {
    return axiosClient.post("/goods-receipts", data);
};