import type { Authority } from "@/lib/types";

export function getDefaultAppRoute(authorities: Authority[]) {
  if (authorities.includes("dashboard:read")) {
    return "/dashboard";
  }

  if (authorities.includes("inventory:read")) {
    return "/products";
  }

  if (authorities.includes("order:read")) {
    return "/orders";
  }

  if (authorities.includes("category:read")) {
    return "/categories";
  }

  return "/login";
}
