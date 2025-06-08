import { StorageService } from './StorageService';
import { STORAGE_KEYS } from '../constants';
import type { Cart, CartItem, Product } from '../../types';

export class CartService {
    private storage: StorageService;

    constructor() {
        this.storage = new StorageService(STORAGE_KEYS.CART);
    }

    getCart(): Cart {
        const cart = this.storage.get<Cart>({ items: [], totalAmount: 0 });
        cart.totalAmount = this.calculateTotalAmount(cart.items);
        return cart;
    }

    addToCart(product: Product): Cart {
        const cart = this.getCart();
        const existingItem = cart.items.find(item => item.code === product.code);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ ...product, quantity: 1 });
        }

        return this.saveCart(cart);
    }

    updateQuantity(code: string, quantity: number): Cart {
        const cart = this.getCart();
        const cartItem = cart.items.find(item => item.code === code);

        if (cartItem) {
            cartItem.quantity = Math.max(0, quantity);
        }

        return this.saveCart(cart);
    }

    removeItem(code: string): Cart {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.code !== code);
        return this.saveCart(cart);
    }

    clearCart(): Cart {
        const emptyCart: Cart = { items: [], totalAmount: 0 };
        this.storage.set(emptyCart);
        return emptyCart;
    }

    getItemCount(): number {
        const cart = this.getCart();
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }

    private calculateTotalAmount(items: CartItem[]): number {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    private saveCart(cart: Cart): Cart {
        cart.totalAmount = this.calculateTotalAmount(cart.items);
        this.storage.set(cart);
        return cart;
    }
}