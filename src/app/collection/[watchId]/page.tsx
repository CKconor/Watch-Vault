import { Nav } from "@/components/layout/nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { WatchDetailPage } from "@/components/collection/watch-detail-page";

export const metadata = { title: "Watch Detail — Watch Vault" };

export default async function WatchDetail({ params }: { params: Promise<{ watchId: string }> }) {
  const { watchId } = await params;
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <AuthGuard>
          <WatchDetailPage watchId={watchId} />
        </AuthGuard>
      </main>
    </>
  );
}
