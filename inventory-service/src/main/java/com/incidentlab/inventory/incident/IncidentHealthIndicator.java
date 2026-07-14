package com.incidentlab.inventory.incident;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Reports the service health based on active incidents.
 * When an incident is active the /actuator/health endpoint returns DOWN,
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
        if (incidentState.errorEnabled) {
            return Health.down()
                    .withDetail("incident", "ERROR_RESPONSE")
                    .withDetail("effect", "All inventory lookups return HTTP 500")
                    .build();
        }
        if (incidentState.slowEnabled) {
            return Health.down()
                    .withDetail("incident", "SLOW_RESPONSE")
                    .withDetail("effect", "All inventory lookups delayed 10 seconds")
                    .build();
        }
        return Health.up().build();
    }
}
