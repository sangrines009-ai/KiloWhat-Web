import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ArrowDownWideNarrow } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, Badge, TrendChart, AxisLabels, Legend, StatCard, DetailRows } from "@/components/kit";
import { anomalies, loadTrend, anomalyReadings } from "@/lib/data";
import { useStore, resolveAnomaly } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anomaly-flags/$id")({
  loader: ({ params }) => {
    if (!anomalies.some((a) => a.id === params.id)) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Investigate Anomaly — KiloWhat Admin" },
      { name: "description", content: "Load trend, readings and details for a flagged anomaly." },
      { property: "og:title", content: "Investigate Anomaly — KiloWhat Admin" },
      { property: "og:description", content: "Load trend, readings and details for a flagged anomaly." },
    ],
  }),
  component: Investigate,
});

function Investigate() {
  const { id } = Route.useParams();
  const a = useStore((s) => s.anomalies.find((x) => x.id === id))!;
  return (
    <AdminLayout title="Anomaly flags">
      <Link to="/anomaly-flags" className="inline-flex items-center gap-3 rounded-md bg-card px-4 py-1.5 text-sm text-ink"><ChevronLeft className="h-4 w-4" />Back to all anomaly</Link>
      <div className="mt-6 flex items-center justify-between pr-5">
        <div className="flex items-center gap-6">
          <div><p className="text-sm font-semibold text-ink">{a.type} — {a.unit}</p><p className="text-xs text-subtle">Compared with previous month</p></div>
          <div className="flex gap-2">
            <Badge tone={a.severity === "Critical" ? "danger" : "warn"}>{a.severity}</Badge>
            <Badge tone={a.status === "Open" ? "danger" : "brand"}>{a.status}</Badge>
          </div>
        </div>
        <Button disabled={a.status === "Resolved"} onClick={() => { resolveAnomaly(a.id); toast.success("Anomaly marked as resolved"); }}>
          {a.status === "Resolved" ? "Resolved" : "Mark as resolved"}
        </Button>
      </div>

      <div className="mt-14 grid grid-cols-[264px_280px_280px_1fr] gap-5">
        <StatCard label="Peak draw" value="5.0 kW" sub="vs. 1.6 kW baseline average" />
        <StatCard label="Deviation" value="+212% above normal" sub="Threshold: +150%" />
        <StatCard label="Duration" value="6h 40m" sub="Started 10:14 AM today" />
        <StatCard label="Est. cost impact" value="₱268.30" sub="" />
      </div>

      <div className="mt-14 grid grid-cols-[1fr_330px] items-start gap-2.5">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <p className="text-base font-semibold text-ink">Load in the last 24 hours</p>
            <Legend items={[{ label: "Meter draw (kW)", color: "bg-danger" }]} />
          </div>
          <div className="mt-4"><TrendChart data={loadTrend} color="var(--danger)" height={200} endDot refLine /></div>
          <AxisLabels labels={["5:15 pm", "11:15pm", "5:15am", "11:15am", "5:00pm"]} />
        </Card>
        <DetailRows title="Flag details" rows={[["Flag ID", a.id], ["Unit / household", a.unit], ["Owner", a.owner], ["Submeter ID", "SM-302A-014"], ["Anomaly type", a.type], ["Detection rule", "Load > 150% of baseline"], ["Detected", a.detected], ["Assigned to", "Unassigned"]]} />
      </div>

      <Card className="mt-6 max-w-[820px] overflow-hidden">
        <p className="px-9 py-5 text-sm font-semibold text-ink">Readings around the flag</p>
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr className="border-b border-border text-left text-xs font-semibold text-subtle">
              <th className="px-6 py-4">Time</th><th className="py-4">Draw</th>
              <th className="py-4"><span className="flex items-center gap-1">vs. baseline <ArrowDownWideNarrow className="h-3 w-3" /></span></th>
              <th className="py-4"><span className="flex items-center gap-1">Note <ArrowDownWideNarrow className="h-3 w-3" /></span></th>
            </tr>
          </thead>
          <tbody>
            {anomalyReadings.map((r) => (
              <tr key={r.time} className={cn("border-b border-border last:border-0", r.flagged && "bg-danger-row")}>
                <td className="px-6 py-3 font-semibold text-ink">{r.time}</td><td className="text-ink">{r.draw}</td>
                <td className="font-semibold text-ink">{r.vs}</td><td className="text-ink">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
