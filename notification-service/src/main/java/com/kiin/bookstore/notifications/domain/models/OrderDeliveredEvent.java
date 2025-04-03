package com.kiin.bookstore.notifications.domain.models;

import com.kiin.bookstore.notifications.domain.models.Address;
import com.kiin.bookstore.notifications.domain.models.Customer;
import com.kiin.bookstore.notifications.domain.models.OrderItem;

import java.time.LocalDateTime;
import java.util.Set;

public record OrderDeliveredEvent(
        String eventId,
        String orderNumber,
        Set<OrderItem> items,
        Customer customer,
        Address deliveryAddress,
        LocalDateTime createdAt) {}
