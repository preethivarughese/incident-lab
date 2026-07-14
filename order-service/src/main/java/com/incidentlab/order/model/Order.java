package com.incidentlab.order.model;

import java.time.LocalDateTime;

public class Order {

    private String orderId;
    private String productId;
    private int quantity;
    private String userId;
    private String status;
    private String message;
    private LocalDateTime createdAt;

    public Order() {}

    public Order(String orderId, String productId, int quantity, String userId,
                 String status, String message, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.userId = userId;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
    }

    // --- Getters and setters ---

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // --- Static builder ---

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String orderId;
        private String productId;
        private int quantity;
        private String userId;
        private String status;
        private String message;
        private LocalDateTime createdAt;

        public Builder orderId(String v)       { this.orderId = v; return this; }
        public Builder productId(String v)     { this.productId = v; return this; }
        public Builder quantity(int v)         { this.quantity = v; return this; }
        public Builder userId(String v)        { this.userId = v; return this; }
        public Builder status(String v)        { this.status = v; return this; }
        public Builder message(String v)       { this.message = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }

        public Order build() {
            return new Order(orderId, productId, quantity, userId, status, message, createdAt);
        }
    }
}
