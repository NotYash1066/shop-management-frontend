import type {
  ApiErrorShape,
  AuthSession,
  Category,
  DashboardStats,
  Employee,
  LoginInput,
  OrderDetail,
  OrderItemInput,
  OrderSummary,
  Product,
  ProductInput,
  ShopRegistrationInput,
  Supplier
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  status: number;
  details?: ApiErrorShape | string;

  constructor(status: number, message: string, details?: ApiErrorShape | string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? {
            Authorization: `Bearer ${options.token}`
          }
        : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload.message || payload.error || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  return payload as T;
}

function normalizeSession(payload: {
  accessToken?: string;
  token?: string;
  tokenType?: string;
  type?: string;
  id: number;
  username: string;
  email: string;
  roles?: string[];
}) {
  return {
    accessToken: payload.accessToken || payload.token || "",
    tokenType: payload.tokenType || payload.type || "Bearer",
    id: payload.id,
    username: payload.username,
    email: payload.email,
    authorities: (payload.roles || []) as AuthSession["authorities"]
  } satisfies AuthSession;
}

function normalizeProduct(payload: any): Product {
  return {
    id: Number(payload.id),
    name: payload.name ?? "Untitled product",
    price: Number(payload.price ?? 0),
    stockQuantity: Number(payload.stockQuantity ?? 0),
    sku: payload.sku ?? "NO-SKU",
    lowStockThreshold: Number(payload.lowStockThreshold ?? 0),
    categoryId: payload.categoryId ?? payload.category?.id ?? null,
    categoryName: payload.categoryName ?? payload.category?.name ?? null,
    supplierId: payload.supplierId ?? payload.supplier?.id ?? null,
    supplierName: payload.supplierName ?? payload.supplier?.name ?? null
  };
}

function normalizeOrder(payload: any): OrderSummary {
  return {
    id: Number(payload.id),
    userId: Number(payload.userId ?? payload.user?.id ?? 0),
    username: payload.username ?? payload.user?.username ?? null,
    email: payload.email ?? payload.user?.email ?? null,
    totalAmount: Number(payload.totalAmount ?? 0),
    status: payload.status ?? "PENDING",
    createdAt: payload.createdAt ?? new Date().toISOString(),
    reconciliationStartedAt: payload.reconciliationStartedAt ?? null,
    reconciliationCompletedAt: payload.reconciliationCompletedAt ?? null,
    reconciliationFailureReason: payload.reconciliationFailureReason ?? null
  };
}

function normalizeOrderDetail(payload: any): OrderDetail {
  return {
    ...normalizeOrder(payload),
    items: (payload.items || payload.orderItems || []).map((item: any) => ({
      id: item.id ? Number(item.id) : undefined,
      productId: Number(item.productId ?? item.product?.id ?? 0),
      productName: item.productName ?? item.product?.name ?? null,
      quantity: Number(item.quantity ?? 0),
      priceAtTimeOfSale: Number(item.priceAtTimeOfSale ?? 0)
    }))
  };
}

export const api = {
  login: async (input: LoginInput) =>
    normalizeSession(
      await request<{
        accessToken?: string;
        token?: string;
        tokenType?: string;
        type?: string;
        id: number;
        username: string;
        email: string;
        roles: string[];
      }>("/auth/login", {
        method: "POST",
        body: input
      })
    ),
  register: async (input: ShopRegistrationInput) =>
    request<string>("/auth/register", {
      method: "POST",
      body: input
    }),
  getDashboardStats: async (token: string) =>
    request<DashboardStats>("/dashboard/stats", { token }),
  getLowStockProducts: async (token: string) =>
    (await request<any[]>("/dashboard/low-stock", { token })).map(normalizeProduct),
  getProducts: async (token: string) =>
    (await request<any[]>("/products", { token })).map(normalizeProduct),
  createProduct: async (token: string, input: ProductInput) =>
    normalizeProduct(
      await request<any>("/products", {
        method: "POST",
        token,
        body: {
          name: input.name,
          price: input.price,
          stockQuantity: input.stockQuantity,
          sku: input.sku,
          lowStockThreshold: input.lowStockThreshold,
          category: input.categoryId ? { id: input.categoryId } : null,
          supplier: input.supplierId ? { id: input.supplierId } : null
        }
      })
    ),
  updateProduct: async (token: string, id: number, input: ProductInput) =>
    normalizeProduct(
      await request<any>(`/products/${id}`, {
        method: "PUT",
        token,
        body: {
          name: input.name,
          price: input.price,
          stockQuantity: input.stockQuantity,
          sku: input.sku,
          lowStockThreshold: input.lowStockThreshold,
          category: input.categoryId ? { id: input.categoryId } : null,
          supplier: input.supplierId ? { id: input.supplierId } : null
        }
      })
    ),
  deleteProduct: async (token: string, id: number) =>
    request<string>(`/products/${id}`, {
      method: "DELETE",
      token
    }),
  getCategories: async (token: string) => request<Category[]>("/categories", { token }),
  createCategory: async (token: string, input: Pick<Category, "name">) =>
    request<Category>("/categories", {
      method: "POST",
      token,
      body: input
    }),
  updateCategory: async (token: string, id: number, input: Pick<Category, "name">) =>
    request<Category>(`/categories/${id}`, {
      method: "PUT",
      token,
      body: input
    }),
  deleteCategory: async (token: string, id: number) =>
    request<string>(`/categories/${id}`, {
      method: "DELETE",
      token
    }),
  getSuppliers: async (token: string) => request<Supplier[]>("/suppliers", { token }),
  createSupplier: async (token: string, input: Pick<Supplier, "name" | "contact">) =>
    request<Supplier>("/suppliers", {
      method: "POST",
      token,
      body: input
    }),
  updateSupplier: async (
    token: string,
    id: number,
    input: Pick<Supplier, "name" | "contact">
  ) =>
    request<Supplier>(`/suppliers/${id}`, {
      method: "PUT",
      token,
      body: input
    }),
  deleteSupplier: async (token: string, id: number) =>
    request<string>(`/suppliers/${id}`, {
      method: "DELETE",
      token
    }),
  getEmployees: async (token: string) => request<Employee[]>("/employees", { token }),
  createEmployee: async (
    token: string,
    input: Pick<Employee, "name" | "role" | "email">
  ) =>
    request<Employee>("/employees", {
      method: "POST",
      token,
      body: input
    }),
  updateEmployee: async (
    token: string,
    id: number,
    input: Pick<Employee, "name" | "role" | "email">
  ) =>
    request<Employee>(`/employees/${id}`, {
      method: "PUT",
      token,
      body: input
    }),
  deleteEmployee: async (token: string, id: number) =>
    request<string>(`/employees/${id}`, {
      method: "DELETE",
      token
    }),
  getUserOrders: async (token: string, userId: number) =>
    (await request<any[]>(`/orders/user/${userId}`, { token })).map(normalizeOrder),
  createOrder: async (token: string, userId: number, items: OrderItemInput[]) =>
    normalizeOrder(
      await request<any>("/orders", {
        method: "POST",
        token,
        body: {
          userId,
          items
        }
      })
    ),
  getAdminOrders: async (token: string) => {
    try {
      const orders = await request<any[]>("/orders", { token });
      return orders.map(normalizeOrder);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  getOrderDetail: async (token: string, orderId: number) => {
    try {
      return normalizeOrderDetail(await request<any>(`/orders/${orderId}`, { token }));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }
};
