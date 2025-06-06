import type { Cart, CartItem, Product } from "../types";

// Key for localStorage
const BOOKSTORE_STATE_KEY = "BOOKSTORE_STATE";


// Calculate total amount based on items in cart
const calculateTotalAmount = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Get cart from localStorage
const getCart = (): Cart => {
    const cartData = localStorage.getItem(BOOKSTORE_STATE_KEY);
    if (!cartData) {
        const newCart: Cart = { items: [], totalAmount: 0 };
        localStorage.setItem(BOOKSTORE_STATE_KEY, JSON.stringify(newCart));
        return newCart;
    }
    const cart: Cart = JSON.parse(cartData);
    cart.totalAmount = calculateTotalAmount(cart.items);
    return cart;
};

export const cartService = {
    // Get the current cart
    getCart,

    // Add a product to the cart
    addToCart: (product: Product): Cart => {
        const cart = getCart();
        const existingItem = cart.items.find(item => item.code === product.code);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ ...product, quantity: 1 });
        }

        cart.totalAmount = calculateTotalAmount(cart.items);
        localStorage.setItem(BOOKSTORE_STATE_KEY, JSON.stringify(cart));
        return cart;
    },

    // Update quantity of an item in cart
    updateQuantity: (code: string, quantity: number): Cart => {
        const cart = getCart();

        const cartItem = cart.items.find(item => item.code === code);
        if (cartItem) {
            cartItem.quantity = quantity > 0 ? quantity : 0;
        }

        cart.totalAmount = calculateTotalAmount(cart.items);
        localStorage.setItem(BOOKSTORE_STATE_KEY, JSON.stringify(cart));
        return cart;
    },

    // Remove item in cart
    removeItem: (code: string): Cart => {
        const cart = getCart();

        const cartItem = cart.items.filter(item => item.code !== code);
        cart.items = cartItem;

        cart.totalAmount = calculateTotalAmount(cart.items);
        localStorage.setItem(BOOKSTORE_STATE_KEY, JSON.stringify(cart));
        return cart;
        },

    // Clear the cart
    clearCart: (): Cart => {
        const emptyCart: Cart = { items: [], totalAmount: 0 };
        localStorage.setItem(BOOKSTORE_STATE_KEY, JSON.stringify(emptyCart));
        return emptyCart;
    },

    // Get number of items in cart
    getItemCount: (): number => {
        const cart = getCart();
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    },

    // // Create an order from cart
    // createOrder: async (orderData: any): Promise<any> => {
    //     const cart = getCart();
    //     const order = {
    //         ...orderData,
    //         items: cart.items
    //     };

    //     const response = await fetch('/api/orders', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(order),
    //     });

    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     // Clear cart after successful order
    //     cartService.clearCart();
    //     return response.json();
    // }
};