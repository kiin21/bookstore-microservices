package com.kiin.bookstore.orders.domain;

import com.kiin.bookstore.orders.domain.models.OrderStatus;
import com.kiin.bookstore.orders.domain.models.OrderSummary;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface OrderRepository extends JpaRepository<com.kiin.bookstore.orders.domain.OrderEntity, Long> {
    List<com.kiin.bookstore.orders.domain.OrderEntity> findByStatus(OrderStatus status);

    Optional<com.kiin.bookstore.orders.domain.OrderEntity> findByOrderNumber(String orderNumber);

    default void updateOrderStatus(String orderNumber, OrderStatus status) {
        com.kiin.bookstore.orders.domain.OrderEntity order =
                this.findByOrderNumber(orderNumber).orElseThrow();
        order.setStatus(status);
        this.save(order);
    }

    @Query(
            """
        select new com.kiin.bookstore.orders.domain.models.OrderSummary(o.orderNumber, o.status)
        from OrderEntity o
        where o.userName = :userName
        """)
    List<OrderSummary> findByUserName(String userName);

    @Query(
            """
        select distinct o
        from OrderEntity o left join fetch o.items
        where o.userName = :userName and o.orderNumber = :orderNumber
        """)
    Optional<OrderEntity> findByUserNameAndOrderNumber(String userName, String orderNumber);
}
