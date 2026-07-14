package com.incidentlab.inventory.model;

import jakarta.validation.constraints.Min;

public class UpdateInventoryRequest {

    @Min(value = 0, message = "quantity must be non-negative")
    private int quantity;

    public UpdateInventoryRequest() {}

    public UpdateInventoryRequest(int quantity) {
        this.quantity = quantity;
    }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
