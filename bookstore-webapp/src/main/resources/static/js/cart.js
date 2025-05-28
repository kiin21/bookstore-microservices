document.addEventListener('alpine:init', () => {
    Alpine.data('initData', () => ({
        cart: { items: [], totalAmount: 0 },
        orderForm: {
            customer: {
                name: "Khoa",
                email: "Khoa@gmail.com",
                phone: "999999999999"
            },
            deliveryAddress: {
                addressLine1: "GC",
                addressLine2: "TG",
                city:"HCMC",
                state: "TS",
                zipCode: "210704",
                country: "VN"
            }
        },

        init() {
            updateCartItemCount();
            this.loadCart();
            this.cart.totalAmount = getCartTotal();
        },
        loadCart() {
            this.cart = getCart()
        },
        updateItemQuantity(code, quantity) {
            updateProductQuantity(code, quantity);
            this.loadCart();
            this.cart.totalAmount = getCartTotal();
        },
        removeCart() {
            deleteCart();
        },
        createOrder() {
            let order = Object.assign({}, this.orderForm, {items: this.cart.items});
            console.log("Order ", order);

            $.ajax ({
                url: '/api/orders',
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data : JSON.stringify(order),
                success: (res) => {
                    this.removeCart();
                    window.location = "/orders/" + res.orderNumber;
                }, error: (err) => {
                    console.log("Order Creation Error:", err)
                    alert("Order creation failed")
                }
            });
        },
    }))
});