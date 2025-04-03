package com.kiin.bookstore.notifications.events;

import com.kiin.bookstore.notifications.domain.NotificationService;
import com.kiin.bookstore.notifications.domain.models.OrderCancelledEvent;
import com.kiin.bookstore.notifications.domain.models.OrderCreatedEvent;
import com.kiin.bookstore.notifications.domain.models.OrderDeliveredEvent;
import com.kiin.bookstore.notifications.domain.models.OrderErrorEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventHandler {

    private final NotificationService notificationService;

    public OrderEventHandler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "${notifications.new-orders-queue}")
    void handlerOrderCreatedEvent(OrderCreatedEvent event) {
        System.out.println("New order has been created " + event.toString());
        notificationService.sendOrderCreatedNotification(event);
    }

    @RabbitListener(queues = "${notifications.delivered-orders-queue}")
    void handlerOrderCreatedEvent(OrderDeliveredEvent event) {
        System.out.println("New order has been created " + event.toString());
        notificationService.sendOrderDeliveredNotification(event);
    }

    @RabbitListener(queues = "${notifications.cancelled-orders-queue}")
    void handlerOrderCreatedEvent(OrderCancelledEvent event) {
        System.out.println("New order has been created " + event.toString());
        notificationService.sendOrderCancelledNotification(event);
    }

    @RabbitListener(queues = "${notifications.error-orders-queue}")
    void handlerOrderCreatedEvent(OrderErrorEvent event) {
        System.out.println("New order has been created " + event.toString());
        notificationService.sendOrderErrorEventNotification(event);
    }
}
