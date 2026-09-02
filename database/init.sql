CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goods_receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    receipt_date DATE NOT NULL,
    unit_name VARCHAR(255),
    department VARCHAR(255),
    sender_name VARCHAR(255),
    document_number VARCHAR(100),
    document_date DATE,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    warehouse_id INTEGER NOT NULL,
    location VARCHAR(255),
    document_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT goods_receipts_warehouse_id_fkey
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
);

CREATE TABLE goods_receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(100),
    unit VARCHAR(50),
    quantity_document NUMERIC(15,2),
    quantity_actual NUMERIC(15,2) NOT NULL,
    unit_price NUMERIC(15,2) NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,

    CONSTRAINT goods_receipt_items_receipt_id_fkey
        FOREIGN KEY (receipt_id)
        REFERENCES goods_receipts(id)
);