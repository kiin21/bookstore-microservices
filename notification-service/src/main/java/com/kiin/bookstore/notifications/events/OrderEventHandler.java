package com.kiin.bookstore.notifications.events;

import com.kiin.bookstore.notifications.domain.NotificationService;
import com.kiin.bookstore.notifications.domain.OrderEventEntity;
import com.kiin.bookstore.notifications.domain.OrderEventRepository;
import com.kiin.bookstore.notifications.domain.models.OrderCancelledEvent;
import com.kiin.bookstore.notifications.domain.models.OrderCreatedEvent;
import com.kiin.bookstore.notifications.domain.models.OrderDeliveredEvent;
import com.kiin.bookstore.notifications.domain.models.OrderErrorEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventHandler {
    Logger log = LoggerFactory.getLogger(OrderEventHandler.class);

    private final NotificationService notificationService;
    private final OrderEventRepository orderEventRepository;

    public OrderEventHandler(NotificationService notificationService, OrderEventRepository orderEventRepository) {
        this.notificationService = notificationService;
        this.orderEventRepository = orderEventRepository;
    }

    @RabbitListener(queues = "${notifications.new-orders-queue}")
    void handlerOrderCreatedEvent(OrderCreatedEvent event) {
        log.info("New Order Event received: {}", event);
        if (orderEventRepository.existsByEventId(event.eventId())) {
            log.warn("Received duplicated OrderCreatedEvent with eventId: {}", event.eventId());
        } else {
            notificationService.sendOrderCreatedNotification(event);
            OrderEventEntity orderEventEntity = new OrderEventEntity(event.eventId());
            orderEventRepository.save(orderEventEntity);
        }
    }

    @RabbitListener(queues = "${notifications.delivered-orders-queue}")
    void handlerOrderCreatedEvent(OrderDeliveredEvent event) {
        log.info("Delivered Order Event received: {}", event);
        if (orderEventRepository.existsByEventId(event.eventId())) {
            log.warn("Received duplicated OrderDeliveredEvent with eventId: {}", event.eventId());
        } else {
            notificationService.sendOrderDeliveredNotification(event);
            OrderEventEntity orderEventEntity = new OrderEventEntity(event.eventId());
            orderEventRepository.save(orderEventEntity);
        }
    }

    @RabbitListener(queues = "${notifications.cancelled-orders-queue}")
    void handlerOrderCreatedEvent(OrderCancelledEvent event) {
        log.info("Cancelled Order Event received: {}", event);
        if (orderEventRepository.existsByEventId(event.eventId())) {
            log.warn("Received duplicated OrderCancelledEvent with eventId: {}", event.eventId());
        } else {
            notificationService.sendOrderCancelledNotification(event);
            OrderEventEntity orderEventEntity = new OrderEventEntity(event.eventId());
            orderEventRepository.save(orderEventEntity);
        }
    }

    @RabbitListener(queues = "${notifications.error-orders-queue}")
    void handlerOrderCreatedEvent(OrderErrorEvent event) {
        log.info("Error Order Event received: {}", event);
        if (orderEventRepository.existsByEventId(event.eventId())) {
            log.warn("Received duplicated OrderErrorEvent with eventId: {}", event.eventId());
        } else {
            notificationService.sendOrderErrorEventNotification(event);
            OrderEventEntity orderEventEntity = new OrderEventEntity(event.eventId());
            orderEventRepository.save(orderEventEntity);
        }
    }
}
