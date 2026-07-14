package com.incidentlab.order.controller;

import com.incidentlab.order.model.CreateOrderRequest;
import com.incidentlab.order.model.Order;
import com.incidentlab.order.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        long start = System.currentTimeMillis();
        try {
            Order order = orderService.createOrder(request);
            log.info("POST /orders completed in {}ms status={}",
                    System.currentTimeMillis() - start, order.getStatus());
            int httpStatus = "CREATED".equals(order.getStatus()) ? 201 : 200;
            return ResponseEntity.status(httpStatus).body(order);
        } catch (NullPointerException e) {
            log.error("NullPointerException in POST /orders: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "error", "NullPointerException",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Exception in POST /orders: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "error", e.getClass().getSimpleName(),
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId) {
        Order order = orderService.getOrder(orderId);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "NotFound",
                    "message", "Order not found: " + orderId
            ));
        }
        return ResponseEntity.ok(order);
    }
}
