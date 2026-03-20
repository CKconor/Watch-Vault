import { Nav } from "@/components/layout/nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { CollectionPage } from "@/components/collection/collection-page";

export const metadata = { title: "Collection — Watch Vault" };

export default function Collection() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <AuthGuard>
          <CollectionPage />
        </AuthGuard>
      </main>
    </>
  );
}
