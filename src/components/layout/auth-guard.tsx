"use client";

import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Only redirect when both Clerk and Convex agree the user is not signed in.
  // If Clerk is signed in but Convex hasn't synced yet, stay on the spinner.
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, isSignedIn, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
