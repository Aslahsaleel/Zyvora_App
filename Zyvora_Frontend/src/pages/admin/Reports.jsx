import { useState } from "react";
import { CalendarDays, ChartNoAxesCombined, IndianRupee } from "lucide-react";
import { getDailyBusiness, getMonthlyBusiness, getYearlyBusiness } from "../../services/adminService";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { Notice } from "../../components/Status";

export default function Reports() {
  const now = new Date();
  const [period, setPeriod] = useState("monthly");
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [report, setReport] = useState(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function run(e) {
    e.preventDefault(); setBusy(true); setError(""); setReport(null);
    try {
      let result;
      if (period === "daily") result = await getDailyBusiness(date);
      else if (period === "yearly") result = await getYearlyBusiness(Number(year));
      else result = await getMonthlyBusiness(Number(month), Number(year));
      setReport(result);
    } catch (err) { setError(getErrorMessage(err, "Unable to generate this report.")); }
    finally { setBusy(false); }
  }
  const categories = Object.entries(report?.categorySales || {});
  return <div><div className="admin-page-heading"><div><span className="eyebrow">INSIGHTS / 04</span><h1>Numbers with <em>meaning.</em></h1><p>Review successful business totals and category sales.</p></div></div>
    <section className="admin-panel report-builder"><div className="panel-heading"><div><span className="eyebrow">REPORT BUILDER</span><h2>Choose a reporting period</h2></div><CalendarDays size={20} /></div><form className="report-form" onSubmit={run}><label>Period<select value={period} onChange={(e) => setPeriod(e.target.value)}><option value="daily">Daily</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>{period === "daily" ? <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label> : <>{period === "monthly" && <label>Month<select value={month} onChange={(e) => setMonth(e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString("en-IN", { month: "long" })}</option>)}</select></label>}<label>Year<input type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(e.target.value)} required /></label></>}<button className="button button-dark" disabled={busy}>{busy ? "Generating..." : "Generate report"} <ChartNoAxesCombined size={16} /></button></form></section>
    <Notice>{error}</Notice>
    {report && <section className="admin-panel report-result"><div className="panel-heading"><div><span className="eyebrow">REPORT RESULT</span><h2>Business summary</h2></div><IndianRupee size={20} /></div><div className="report-total"><span>TOTAL BUSINESS</span><strong>{formatPrice(report.totalBusiness)}</strong></div><h3>Category sales</h3>{categories.length ? categories.map(([name, count]) => <div className="sales-row" key={name}><span>{name || "Uncategorised"}</span><span className="sales-track"><i style={{ width: `${Math.max(4, Number(count) / Math.max(...categories.map(([, value]) => Number(value))) * 100)}%` }} /></span><strong>{count}</strong></div>) : <p className="muted">No sales recorded for this period.</p>}</section>}
  </div>;
}
