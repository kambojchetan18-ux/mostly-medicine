import FunLoading from "@/components/FunLoading";

export default function LibraryLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "📚 Asking the librarian…",
          "🔎 Skimming Murtagh's…",
          "📖 Dusting off eTG…",
          "🧐 Looking up the reference…",
        ]}
      />
    </div>
  );
}
