import type { Address } from "./order";

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    addresses?: Address[];
    createdAt: string;
    updatedAt: string;
}

export interface AuthUser {
    user: User;
    token: string;
    refreshToken?: string;
    expiresAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }