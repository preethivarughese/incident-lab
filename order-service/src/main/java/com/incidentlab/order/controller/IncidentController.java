package com.incidentlab.order.controller;

import com.incidentlab.order.incident.IncidentState;
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

    /** Starts a background CPU-busy loop. Simulates a CPU spike. */
    @PostMapping("/cpu")
    public ResponseEntity<Map<String, String>> triggerCpu() {
        incidentState.enableCpu();
        return ResponseEntity.ok(Map.of(
                "incident", "CPU_LOAD",
                "status", "ACTIVE",
                "effect", "Background CPU thread running - watch CPU metrics spike"
        ));
    }

    /** Makes all calls to Inventory Service fail immediately. */
    @PostMapping("/dependency")
    public ResponseEntity<Map<String, String>> triggerDependency() {
        incidentState.dependencyFailureEnabled = true;
        log.warn("Incident triggered: DEPENDENCY_FAILURE");
        return ResponseEntity.ok(Map.of(
                "incident", "DEPENDENCY_FAILURE",
                "status", "ACTIVE",
                "effect", "All inventory service calls will fail - orders will be marked FAILED"
        ));
    }

    /** Throws NullPointerException on every order creation. */
    @PostMapping("/npe")
    public ResponseEntity<Map<String, String>> triggerNpe() {
        incidentState.npeEnabled = true;
        log.warn("Incident triggered: NULL_POINTER_EXCEPTION");
        return ResponseEntity.ok(Map.of(
                "incident", "NULL_POINTER_EXCEPTION",
                "status", "ACTIVE",
                "effect", "POST /orders now throws NullPointerException - HTTP 500"
        ));
    }

    /** Starts a background memory-leak thread allocating 1MB every 500ms. */
    @PostMapping("/memory")
    public ResponseEntity<Map<String, String>> triggerMemoryLeak() {
        incidentState.enableMemoryLeak();
        return ResponseEntity.ok(Map.of(
                "incident", "MEMORY_LEAK",
                "status", "ACTIVE",
                "effect", "Allocating 1MB every 500ms - watch JVM heap grow"
        ));
    }

    /** Makes 30% of order requests fail randomly. */
    @PostMapping("/random")
    public ResponseEntity<Map<String, String>> triggerRandomErrors() {
        incidentState.randomErrorEnabled = true;
        log.warn("Incident triggered: RANDOM_ERRORS (30% failure rate)");
        return ResponseEntity.ok(Map.of(
                "incident", "RANDOM_ERRORS",
                "status", "ACTIVE",
                "effect", "30% of POST /orders requests will return HTTP 500"
        ));
    }

    /** Resets all active incidents. Order Service returns to healthy state. */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> reset() {
        incidentState.reset();
        return ResponseEntity.ok(Map.of(
                "status", "ALL_INCIDENTS_CLEARED",
                "service", "order-service"
        ));
    }

    /** Returns current incident state for all flags. */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "service", "order-service",
                "cpuEnabled", incidentState.cpuEnabled,
                "dependencyFailureEnabled", incidentState.dependencyFailureEnabled,
                "npeEnabled", incidentState.npeEnabled,
                "memoryLeakEnabled", incidentState.memoryLeakEnabled,
                "randomErrorEnabled", incidentState.randomErrorEnabled
        ));
    }
}
