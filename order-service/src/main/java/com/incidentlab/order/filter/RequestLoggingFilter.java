package com.incidentlab.order.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Attaches structured fields to every request log via MDC:
 * requestId, endpoint, method, httpStatus, latencyMs, userId, service
 */
@Component
public class RequestLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestId = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        MDC.put("requestId", requestId);
        MDC.put("endpoint", httpRequest.getRequestURI());
        MDC.put("method", httpRequest.getMethod());
        MDC.put("service", "order-service");

        String userId = httpRequest.getHeader("X-User-Id");
        if (userId != null) MDC.put("userId", userId);

        long start = System.currentTimeMillis();
        try {
            chain.doFilter(request, response);
        } finally {
            long latencyMs = System.currentTimeMillis() - start;
            int status = httpResponse.getStatus();
            MDC.put("latencyMs", String.valueOf(latencyMs));
            MDC.put("httpStatus", String.valueOf(status));

            if (status >= 500) {
                log.error("Request completed status={} latencyMs={}", status, latencyMs);
            } else if (status >= 400) {
                log.warn("Request completed status={} latencyMs={}", status, latencyMs);
            } else {
                log.info("Request completed status={} latencyMs={}", status, latencyMs);
            }
            MDC.clear();
        }
    }
}
