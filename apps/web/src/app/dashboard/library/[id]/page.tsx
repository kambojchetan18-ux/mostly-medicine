import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import LibraryChat from "@/components/LibraryChat";

type TopicContent = {
  overview: string;
  key_points: string[];
  red_flags: string[];
  amc_relevance: string;
  reference: string;
};

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("library_topics")
    .select("*")
    .eq("id", id)
    .single();

  if (!topic) notFound();

  const content = topic.content as TopicContent;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/library"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 transition"
      >
        ← Back to Library
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            {topic.source}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {topic.system}
          </span>
          {topic.difficulty && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              topic.difficulty === "Easy" ? "bg-green-100 text-green-700" :
              topic.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {topic.difficulty}
            </span>
          )}
          {topic.amc_exam_type?.map((type: string) => (
            <span key={type} className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 font-medium">
              {type}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
        <p className="text-gray-500 mt-2">{topic.summary}</p>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-brand-600">📋</span> Overview
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{content.overview}</p>
        </section>

        {/* Key Points */}
        {content.key_points?.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-brand-600">⭐</span> Key Points
            </h2>
            <ul className="space-y-2">
              {content.key_points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-brand-400 mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Red Flags */}
        {content.red_flags?.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-red-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> Red Flags
            </h2>
            <ul className="space-y-1.5">
              {content.red_flags.map((flag, i) => (
                <li key={i} className="flex gap-2 text-sm text-red-700">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* AMC Relevance */}
        {content.amc_relevance && (
          <section className="bg-brand-50 border border-brand-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-brand-800 mb-3 flex items-center gap-2">
              <span>🎯</span> AMC Exam Relevance
            </h2>
            <p className="text-sm text-brand-700 leading-relaxed">{content.amc_relevance}</p>
          </section>
        )}

        {/* Reference */}
        {content.reference && (
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Reference:</span> {content.reference}
            </p>
          </section>
        )}

        {/* Related Cases link */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/cases"
            className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition"
          >
            View Related Cases →
          </Link>
        </div>
      </div>

      <LibraryChat
        topicTitle={topic.title}
        topicContent={JSON.stringify(content)}
      />
    </div>
  );
}
