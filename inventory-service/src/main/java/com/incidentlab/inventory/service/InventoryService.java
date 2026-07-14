package com.incidentlab.inventory.service;

import com.incidentlab.inventory.incident.IncidentState;
import com.incidentlab.inventory.model.InventoryItem;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final IncidentState incidentState;
    private final Map<String, InventoryItem> inventory = new ConcurrentHashMap<>();

    public InventoryService(IncidentState incidentState) {
        this.incidentState = incidentState;
    }

    @PostConstruct
    public void init() {
        inventory.put("P001", new InventoryItem("P001", "Widget A", 100, true));
        inventory.put("P002", new InventoryItem("P002", "Widget B", 50, true));
        inventory.put("P003", new InventoryItem("P003", "Widget C", 0, false));
        inventory.put("P004", new InventoryItem("P004", "Gadget X", 200, true));
        inventory.put("P005", new InventoryItem("P005", "Gadget Y", 75, true));
        log.info("Inventory initialized with {} products", inventory.size());
    }

    public InventoryItem getInventory(String productId) throws InterruptedException {
        if (incidentState.errorEnabled) {
            log.error("ERROR incident active - throwing exception for productId={}", productId);
            throw new RuntimeException("Inventory service internal error (incident active)");
        }

        if (incidentState.slowEnabled) {
            log.warn("SLOW incident active - sleeping 10s for productId={}", productId);
            Thread.sleep(10_000);
        }

        InventoryItem item = inventory.get(productId);
        if (item == null) {
            log.warn("Product not found: productId={}", productId);
            return new InventoryItem(productId, "Unknown", 0, false);
        }

        log.debug("Returning inventory for productId={} quantity={}", productId, item.getQuantity());
        return item;
    }

    public InventoryItem updateInventory(String productId, int quantity) {
        InventoryItem item = inventory.getOrDefault(productId,
                new InventoryItem(productId, "Unknown", 0, false));
        item.setQuantity(quantity);
        item.setInStock(quantity > 0);
        inventory.put(productId, item);
        log.info("Inventory updated: productId={} newQuantity={}", productId, quantity);
        return item;
    }
}
