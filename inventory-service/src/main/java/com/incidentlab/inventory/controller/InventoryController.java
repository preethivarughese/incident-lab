package com.incidentlab.inventory.controller;

import com.incidentlab.inventory.model.InventoryItem;
import com.incidentlab.inventory.model.UpdateInventoryRequest;
import com.incidentlab.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private static final Logger log = LoggerFactory.getLogger(InventoryController.class);

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryItem> getInventory(@PathVariable String productId)
            throws InterruptedException {
        log.info("GET /inventory/{}", productId);
        return ResponseEntity.ok(inventoryService.getInventory(productId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryItem> updateInventory(
            @PathVariable String productId,
            @Valid @RequestBody UpdateInventoryRequest request) {
        log.info("PUT /inventory/{} quantity={}", productId, request.getQuantity());
        return ResponseEntity.ok(inventoryService.updateInventory(productId, request.getQuantity()));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "inventory-service"));
    }
}
