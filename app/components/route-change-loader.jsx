'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export function RouteChangeLoader() {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsRouteChanging(true);
    const handleComplete = () => setIsRouteChanging(false);

    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleComplete);
    router.events?.on('routeChangeError', handleComplete);

    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleComplete);
      router.events?.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return isRouteChanging ? <LoadingOverlay /> : null;
} 