export interface GoodsReceiptItem {
    id: number;
    itemName: string;
    itemCode: string;
    unit: string;
    quantityDocument: number;
    quantityActual: number;
    unitPrice: number;
    totalAmount: number;
  }
  
  export interface GoodsReceipt {
    receiptNumber: string;
    receiptDate: string;
  
    unitName: string;
    department: string;
  
    senderName: string;
  
    documentNumber: string;
    documentDate: string;
  
    invoiceNumber: string;
    invoiceDate: string;
  
    warehouseId: string;
    location: string;
    documentType: string;
    items: GoodsReceiptItem[];
  }