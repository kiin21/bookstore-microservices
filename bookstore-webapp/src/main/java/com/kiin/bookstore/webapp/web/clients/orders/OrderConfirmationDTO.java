package com.kiin.bookstore.webapp.web.clients.orders;

public record OrderConfirmationDTO(String orderNumber, OrderStatus status) {}
