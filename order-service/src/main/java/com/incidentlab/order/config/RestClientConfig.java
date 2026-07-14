package com.incidentlab.order.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${inventory.service.url:http://localhost:8081}")
    private String inventoryServiceUrl;

    @Bean
    public RestClient inventoryRestClient(RestClient.Builder builder) {
        return builder
                .baseUrl(inventoryServiceUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
