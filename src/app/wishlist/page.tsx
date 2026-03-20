import { Nav } from "@/components/layout/nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { WishlistPageContent } from "@/components/wishlist/wishlist-page-content";

export const metadata = { title: "Wishlist — Watch Vault" };

export default function Wishlist() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <AuthGuard>
          <WishlistPageContent />
        </AuthGuard>
      </main>
    </>
  );
}
