export type Authority =
  | "ROLE_ADMIN"
  | "ROLE_USER"
  | "inventory:read"
  | "inventory:write"
  | "category:read"
  | "category:write"
  | "supplier:read"
  | "supplier:write"
  | "employee:read"
  | "employee:write"
  | "order:create"
  | "order:read"
  | "dashboard:read";

export type ApiErrorShape = {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
};

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  authorities: Authority[];
};

export type ShopRegistrationInput = {
  username: string;
  email: string;
  password: string;
  shopName: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Supplier = {
  id: number;
  name: string;
  contact: string;
};

export type Employee = {
  id: number;
  name: string;
  role: string;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  sku: string;
  lowStockThreshold: number;
  categoryId: number | null;
  categoryName: string | null;
  supplierId: number | null;
  supplierName: string | null;
};

export type ProductInput = {
  name: string;
  price: number;
  stockQuantity: number;
  sku: string;
  lowStockThreshold: number;
  categoryId: number | null;
  supplierId: number | null;
};

export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED";

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type OrderSummary = {
  id: number;
  userId: number;
  username?: string | null;
  email?: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  reconciliationStartedAt?: string | null;
  reconciliationCompletedAt?: string | null;
  reconciliationFailureReason?: string | null;
};

export type OrderDetail = OrderSummary & {
  items: Array<{
    id?: number;
    productId: number;
    productName?: string | null;
    quantity: number;
    priceAtTimeOfSale: number;
  }>;
};
