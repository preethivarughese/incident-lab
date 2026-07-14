package com.incidentlab.order.incident;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Reports the service health based on active incidents.
 * When any incident is active the /actuator/health endpoint returns DOWN,
 * making the UI health card reflect the real degraded state.
 */
@Component
public class IncidentHealthIndicator implements HealthIndicator {

    private final IncidentState incidentState;

    public IncidentHealthIndicator(IncidentState incidentState) {
        this.incidentState = incidentState;
    }

    @Override
    public Health health() {
        if (incidentState.npeEnabled) {
            return Health.down()
                    .withDetail("incident", "NULL_POINTER_EXCEPTION")
                    .withDetail("effect", "POST /orders throws NPE → HTTP 500")
                    .build();
        }
        if (incidentState.dependencyFailureEnabled) {
            return Health.down()
                    .withDetail("incident", "DEPENDENCY_FAILURE")
                    .withDetail("effect", "All inventory calls fail immediately")
                    .build();
        }
        if (incidentState.randomErrorEnabled) {
            return Health.down()
                    .withDetail("incident", "RANDOM_ERRORS")
                    .withDetail("effect", "30% of order requests return HTTP 500")
                    .build();
        }
        if (incidentState.cpuEnabled) {
            return Health.down()
                    .withDetail("incident", "CPU_LOAD")
                    .withDetail("effect", "CPU saturated by background busy loop")
                    .build();
        }
        if (incidentState.memoryLeakEnabled) {
            return Health.down()
                    .withDetail("incident", "MEMORY_LEAK")
                    .withDetail("effect", "JVM heap growing — 1MB allocated every 500ms")
                    .build();
        }
        return Health.up().build();
    }
}
