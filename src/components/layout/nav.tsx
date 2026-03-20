"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/collection", label: "Collection" },
  { href: "/wishlist", label: "Wishlist" },
];

export function Nav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-10 px-4">
        {/* Logo */}
        <Link href="/collection" className="flex items-center gap-3 select-none group">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/50 bg-primary/8 transition-colors group-hover:border-primary/70 group-hover:bg-primary/12">
            <span className="text-sm leading-none text-primary">◈</span>
          </div>
          <span
            className="text-lg tracking-wider text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Watch Vault
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative pb-0.5 text-sm tracking-wide transition-colors",
                pathname.startsWith(href)
                  ? "text-foreground after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <>
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.imageUrl} alt={user.fullName ?? "User"} />
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {user.fullName?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
