import FunLoading from "@/components/FunLoading";

// Top-level dashboard fallback — covers any nested route that doesn't have
// its own loading.tsx. Next.js App Router shows this during navigation /
// server-component data fetches.
export default function DashboardLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading />
    </div>
  );
}
