package com.incidentlab.inventory.controller;

import com.incidentlab.inventory.incident.IncidentState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/incident")
public class IncidentController {

    private static final Logger log = LoggerFactory.getLogger(IncidentController.class);

    private final IncidentState incidentState;

    public IncidentController(IncidentState incidentState) {
        this.incidentState = incidentState;
    }

    /**
     * Enables slow response: all inventory lookups will sleep 10 seconds.
     * Simulates a dependency that became slow after a bad deployment.
     */
    @PostMapping("/slow")
    public ResponseEntity<Map<String, String>> triggerSlow() {
        incidentState.slowEnabled = true;
        log.warn("Incident triggered: SLOW_RESPONSE - inventory will delay 10s on every request");
        return ResponseEntity.ok(Map.of(
                "incident", "SLOW_RESPONSE",
                "status", "ACTIVE",
                "effect", "All inventory lookups now take 10 seconds"
        ));
    }

    /**
     * Enables error responses: all inventory lookups will return HTTP 500.
     * Simulates a broken dependency after a bad deployment.
     */
    @PostMapping("/error")
    public ResponseEntity<Map<String, String>> triggerError() {
        incidentState.errorEnabled = true;
        log.warn("Incident triggered: ERROR_RESPONSE - inventory will return 500 on every request");
        return ResponseEntity.ok(Map.of(
                "incident", "ERROR_RESPONSE",
                "status", "ACTIVE",
                "effect", "All inventory lookups now return HTTP 500"
        ));
    }

    /**
     * Resets all active incidents. Inventory returns to healthy state.
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> reset() {
        incidentState.reset();
        return ResponseEntity.ok(Map.of(
                "status", "ALL_INCIDENTS_CLEARED",
                "service", "inventory-service"
        ));
    }

    /**
     * Returns the current incident state.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "service", "inventory-service",
                "slowEnabled", incidentState.slowEnabled,
                "errorEnabled", incidentState.errorEnabled
        ));
    }
}
