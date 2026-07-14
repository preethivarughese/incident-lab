package com.incidentlab.inventory.incident;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Holds the current incident flags for Inventory Service.
 * All fields are volatile so changes are visible across threads immediately.
 */
@Component
public class IncidentState {

    private static final Logger log = LoggerFactory.getLogger(IncidentState.class);

    public volatile boolean slowEnabled = false;
    public volatile boolean errorEnabled = false;

    public void reset() {
        slowEnabled = false;
        errorEnabled = false;
        log.info("Inventory incident state reset - all incidents cleared");
    }
}
