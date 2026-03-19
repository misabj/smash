const API_BASE = "/api";

function getToken(): string | null {
    return localStorage.getItem("admin_token");
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Greška na serveru" }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// Auth
export const authApi = {
    login: (username: string, password: string) =>
        request<{ token: string; user: { id: number; username: string; role: string } }>(
            "/auth/login",
            { method: "POST", body: JSON.stringify({ username, password }) }
        ),
    me: () =>
        request<{ user: { id: number; username: string; role: string } }>("/auth/me"),
    changePassword: (currentPassword: string, newPassword: string) =>
        request<{ message: string }>("/auth/password", {
            method: "PUT",
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};

// Menu
export interface MenuItemAPI {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: "burger" | "sandwich" | "sides" | "drinks";
    tags: string[];
    popular: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export const menuApi = {
    getAll: () => request<MenuItemAPI[]>("/menu"),
    getAllAdmin: () => request<MenuItemAPI[]>("/menu/all"),
    getById: (id: number) => request<MenuItemAPI>(`/menu/${id}`),
    create: (data: Partial<MenuItemAPI>) =>
        request<MenuItemAPI>("/menu", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<MenuItemAPI>) =>
        request<MenuItemAPI>(`/menu/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
        request<{ message: string }>(`/menu/${id}`, { method: "DELETE" }),
};

// Orders
export interface OrderAPI {
    id: number;
    tracking_code: string;
    customer_name: string | null;
    customer_phone: string | null;
    customer_email: string | null;
    delivery_address: string | null;
    items: { id: number; name: string; price: number; quantity: number }[];
    total: number;
    status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
    estimated_delivery_at: string | null;
    created_at: string;
}

export interface TrackingOrderAPI {
    id: number;
    tracking_code: string;
    customer_name: string | null;
    delivery_address: string;
    items: { id: number; name: string; price: number; quantity: number }[];
    total: number;
    status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
    estimated_delivery_at: string | null;
    created_at: string;
}

export const ordersApi = {
    getAll: () => request<OrderAPI[]>("/orders"),
    create: (data: { customerName?: string; customerPhone?: string; customerEmail: string; deliveryAddress: string; items: any[]; total: number }) =>
        request<OrderAPI>("/orders", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: number, status: string, prepMinutes?: number) =>
        request<OrderAPI>(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status, prepMinutes }) }),
    track: (code: string) => request<TrackingOrderAPI>(`/orders/track/${encodeURIComponent(code)}`),
};

// Stats
export interface StatsAPI {
    totalMenuItems: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: OrderAPI[];
    categoryStats: { category: string; count: number }[];
}

export const statsApi = {
    get: () => request<StatsAPI>("/stats"),
};

// Promotions
export interface PromotionAPI {
    id: number;
    name: string;
    description: string;
    discount_percent: number;
    applicable_category: "burger" | "sandwich" | "sides" | "drinks" | "all";
    start_date: string;
    end_date: string;
    active: boolean;
    created_at: string;
}

export const promotionsApi = {
    getActive: () => request<PromotionAPI[]>("/promotions"),
    getAllAdmin: () => request<PromotionAPI[]>("/promotions/all"),
    create: (data: Partial<PromotionAPI>) =>
        request<PromotionAPI>("/promotions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<PromotionAPI>) =>
        request<PromotionAPI>(`/promotions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
        request<{ message: string }>(`/promotions/${id}`, { method: "DELETE" }),
};
