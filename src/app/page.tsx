"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";
import { getDefaultAppRoute } from "@/lib/routes";

export default function HomePage() {
  const router = useRouter();
  const { hydrated, session } = useAuth();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    router.replace(getDefaultAppRoute(session.authorities));
  }, [hydrated, router, session]);

  return null;
}
