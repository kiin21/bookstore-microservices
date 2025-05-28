package com.kiin.bookstore.webapp.web.controllers;

import com.kiin.bookstore.webapp.web.clients.orders.*;
import com.kiin.bookstore.webapp.web.clients.services.SecurityHelper;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderServiceClient orderServiceClient;
    private final SecurityHelper securityHelper;

    OrderController(OrderServiceClient orderServiceClient, SecurityHelper securityHelper) {
        this.orderServiceClient = orderServiceClient;
        this.securityHelper = securityHelper;
    }

    @GetMapping("/cart")
    String cart() {
        return "cart";
    }

    @PostMapping("/api/orders")
    @ResponseBody
    OrderConfirmationDTO createOrder(@Valid @RequestBody CreateOrderRequest orderRequest) {
        log.info("Creating order: {}", orderRequest);
        String accessToken = securityHelper.getAccessToken();
        Map<String, ?> headers = Map.of("Authorization", "Bearer " + accessToken);
        OrderConfirmationDTO res = orderServiceClient.createOrder(headers, orderRequest);
        return res;
    }

    @GetMapping("/orders/{orderNumber}")
    String showOrderDetails(@PathVariable String orderNumber, Model model) {
        model.addAttribute("orderNumber", orderNumber);
        return "order_details";
    }

    @GetMapping("/api/orders/{orderNumber}")
    @ResponseBody
    OrderDTO getOrder(@PathVariable String orderNumber) {
        log.info("Fetching order details for orderNumber: {}", orderNumber);
        String accessToken = securityHelper.getAccessToken();
        Map<String, ?> headers = Map.of("Authorization", "Bearer " + accessToken);
        return orderServiceClient.getOrder(headers, orderNumber);
    }

    @GetMapping("/orders")
    String showOrders() {
        return "orders";
    }

    @GetMapping("/api/orders")
    @ResponseBody
    List<OrderSummary> getOrders() {
        log.info("Fetching orders");
        String accessToken = securityHelper.getAccessToken();
        Map<String, ?> headers = Map.of("Authorization", "Bearer " + accessToken);
        return orderServiceClient.getOrders(headers);
    }
}
