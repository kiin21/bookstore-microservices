document.addEventListener('alpine:init', () => {
    Alpine.data('initData', (orderNumber) => ({
        orderNumber: orderNumber,
        orderDetails : {
            items: [],
            customer: {},
            deliveryAddress: {},
        },
        init() {
            updateCartItemCount();
            this.getOrderDetails(this.orderNumber);
        },
        getOrderDetails(orderNumber) {
            $.getJSON("/api/orders/" + orderNumber, (res) => {
                console.log("Get Order Resp:", res)
                this.orderDetails = res;
            });
        }
    }))
});