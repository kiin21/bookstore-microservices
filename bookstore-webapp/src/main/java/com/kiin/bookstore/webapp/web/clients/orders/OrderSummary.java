package com.kiin.bookstore.webapp.web.clients.orders;

public record OrderSummary(String orderNumber, OrderStatus status) {}