import StatsMetric from "@/components/dashboard/StatsMetric";

export default function StatsRow({ stats }) {
  return (
    <div className="
      grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4
      gap-8 sm:gap-12 mt-10
    ">
      <StatsMetric label="Total Notes" value={stats.totalNotes} />
      <StatsMetric label="Flashcards" value={stats.totalFlashcards} />
      <StatsMetric label="Uploads" value={stats.totalUploads} />
      <StatsMetric label="Accuracy %" value={stats.studyAccuracy} />
    </div>
  );
}