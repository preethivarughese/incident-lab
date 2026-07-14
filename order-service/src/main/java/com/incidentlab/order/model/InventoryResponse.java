package com.incidentlab.order.model;

public class InventoryResponse {

    private String productId;
    private String productName;
    private int quantity;
    private boolean inStock;

    public InventoryResponse() {}

    public InventoryResponse(String productId, String productName, int quantity, boolean inStock) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.inStock = inStock;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
}
