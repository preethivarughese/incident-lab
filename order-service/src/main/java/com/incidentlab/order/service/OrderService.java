package com.incidentlab.order.service;

import com.incidentlab.order.incident.IncidentState;
import com.incidentlab.order.model.CreateOrderRequest;
import com.incidentlab.order.model.InventoryResponse;
import com.incidentlab.order.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final IncidentState incidentState;
    private final RestClient inventoryRestClient;

    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final AtomicLong orderCounter = new AtomicLong(1000);
    private final Random random = new Random();

    public OrderService(IncidentState incidentState, RestClient inventoryRestClient) {
        this.incidentState = incidentState;
        this.inventoryRestClient = inventoryRestClient;
    }

    public Order createOrder(CreateOrderRequest request) {
        String orderId = "ORD-" + orderCounter.getAndIncrement();

        // --- NPE incident ---
        if (incidentState.npeEnabled) {
            log.error("NPE incident active - throwing NullPointerException");
            throw new NullPointerException("Order processing failed: order context is null");
        }

        // --- Random error incident ---
        if (incidentState.randomErrorEnabled && random.nextInt(100) < 30) {
            log.error("Random error incident: 30% failure rate triggered for orderId={}", orderId);
            throw new RuntimeException("Random failure (30% error rate incident active)");
        }

        // --- Dependency failure incident ---
        if (incidentState.dependencyFailureEnabled) {
            log.error("Dependency failure incident active - inventory service unavailable");
            Order failed = buildOrder(orderId, request, "FAILED",
                    "Inventory service unavailable (dependency failure incident active)");
            orders.put(orderId, failed);
            return failed;
        }

        // --- Call inventory service ---
        InventoryResponse inventory;
        try {
            inventory = inventoryRestClient.get()
                    .uri("/inventory/{productId}", request.getProductId())
                    .retrieve()
                    .body(InventoryResponse.class);
        } catch (Exception e) {
            log.error("Failed to reach inventory service: {}", e.getMessage());
            Order failed = buildOrder(orderId, request, "FAILED",
                    "Inventory service unreachable: " + e.getMessage());
            orders.put(orderId, failed);
            return failed;
        }

        // --- Check stock ---
        if (inventory == null || !inventory.isInStock()
                || inventory.getQuantity() < request.getQuantity()) {
            log.warn("Insufficient inventory for productId={} requested={} available={}",
                    request.getProductId(), request.getQuantity(),
                    inventory == null ? 0 : inventory.getQuantity());
            Order rejected = buildOrder(orderId, request, "REJECTED", "Insufficient inventory");
            orders.put(orderId, rejected);
            return rejected;
        }

        // --- Create order ---
        Order created = buildOrder(orderId, request, "CREATED", "Order placed successfully");
        orders.put(orderId, created);
        log.info("Order created: orderId={} productId={} quantity={} userId={}",
                orderId, request.getProductId(), request.getQuantity(), request.getUserId());
        return created;
    }

    public Order getOrder(String orderId) {
        return orders.get(orderId);
    }

    private Order buildOrder(String orderId, CreateOrderRequest req, String status, String message) {
        return Order.builder()
                .orderId(orderId)
                .productId(req.getProductId())
                .quantity(req.getQuantity())
                .userId(req.getUserId())
                .status(status)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
