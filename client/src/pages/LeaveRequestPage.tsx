import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

/* ── helpers ──────────────────────────────────────────────────── */
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function calcDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function getMonday(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay();
  return first === 0 ? 6 : first - 1;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Emergency Leave",
  "Unpaid Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Compassionate Leave",
];

/* ── 2026 holidays ─────────────────────────────────────────────── */
interface Holiday {
  name: string;
  date: string; // YYYY-MM-DD
  tag: string;
}

const HOLIDAYS: Holiday[] = [
  { name: "Ugadi",               date: "2026-03-19", tag: "Flex" },
  { name: "Id-ul-Fitr (Ramzan)", date: "2026-03-31", tag: "Flex" },
  { name: "Good Friday",         date: "2026-04-03", tag: "Flex" },
  { name: "Labour Day",          date: "2026-05-01", tag: "Public" },
  { name: "Wesak Day",           date: "2026-05-12", tag: "Public" },
  { name: "Hari Raya Haji",      date: "2026-06-08", tag: "Public" },
  { name: "National Day",        date: "2026-08-31", tag: "Public" },
  { name: "Malaysia Day",        date: "2026-09-16", tag: "Public" },
  { name: "Deepavali",           date: "2026-10-20", tag: "Flex" },
  { name: "Christmas Day",       date: "2026-12-25", tag: "Public" },
  { name: "New Year's Day",      date: "2026-01-01", tag: "Public" },
];

/* ── types ─────────────────────────────────────────────────────── */
type LeaveStatus = "Approved" | "Pending" | "Rejected";

interface LeaveEntry {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  appliedDate: string;
  comments: string;
}

/* ── status helpers ─────────────────────────────────────────────── */
const STATUS_STYLES: Record<LeaveStatus, string> = {
  Approved: "bg-green-100 text-green-700 border border-green-200",
  Pending:  "bg-amber-100 text-amber-700 border border-amber-200",
  Rejected: "bg-red-100  text-red-700   border border-red-200",
};

/* ══════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function LeaveRequestPage() {
  const [today] = useState(new Date());
  const todayStr = today.toISOString().slice(0, 10);

  /* ── leaves state ─────────────────────────────────────────────── */
  const [leaves, setLeaves] = useState<LeaveEntry[]>([]);

  /* ── filters ──────────────────────────────────────────────────── */
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter]     = useState("All Types");
  const [statusOpen, setStatusOpen]     = useState(false);
  const [typeOpen, setTypeOpen]         = useState(false);

  /* ── modal ────────────────────────────────────────────────────── */
  const [showModal, setShowModal] = useState(false);
  const [fType,      setFType]    = useState("");
  const [fStart,     setFStart]   = useState("");
  const [fEnd,       setFEnd]     = useState("");
  const [fComments,  setFComments]= useState("");
  const [typeDropOpen, setTypeDropOpen] = useState(false);
  const [modalErr, setModalErr] = useState("");

  function openModal() {
    setFType(""); setFStart(""); setFEnd(""); setFComments(""); setModalErr("");
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); }

  function submitLeave() {
    if (!fType)  { setModalErr("Please select a leave type."); return; }
    if (!fStart) { setModalErr("Please select a start date."); return; }
    if (!fEnd)   { setModalErr("Please select an end date."); return; }
    if (fEnd < fStart) { setModalErr("End date must be on or after start date."); return; }

    const days = calcDays(fStart, fEnd);
    const entry: LeaveEntry = {
      id: uid(),
      type: fType,
      startDate: fStart,
      endDate: fEnd,
      days,
      status: "Pending",
      appliedDate: todayStr,
      comments: fComments,
    };
    setLeaves(prev => [entry, ...prev]);
    closeModal();
  }

  /* ── filtered leaves ──────────────────────────────────────────── */
  const filtered = useMemo(() => leaves.filter(l => {
    const matchSearch = search === "" ||
      l.type.toLowerCase().includes(search.toLowerCase()) ||
      l.comments.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || l.status === statusFilter;
    const matchType   = typeFilter   === "All Types"  || l.type   === typeFilter;
    return matchSearch && matchStatus && matchType;
  }), [leaves, search, statusFilter, typeFilter]);

  /* ── legend counts ────────────────────────────────────────────── */
  const approved = leaves.filter(l => l.status === "Approved").length;
  const pending  = leaves.filter(l => l.status === "Pending").length;
  const rejected = leaves.filter(l => l.status === "Rejected").length;

  /* ── calendar ─────────────────────────────────────────────────── */
  const [calDate, setCalDate] = useState(() =>
    new Date(today.getFullYear(), today.getMonth())
  );
  const calMonth = calDate.getMonth();
  const calYear  = calDate.getFullYear();

  const holidaySet = useMemo(() => {
    const s = new Set<string>();
    HOLIDAYS.forEach(h => s.add(h.date));
    return s;
  }, []);

  function isToday(day: number | null, m: number, y: number) {
    if (!day) return false;
    return today.getDate() === day && today.getMonth() === m && today.getFullYear() === y;
  }

  function isHolidayDay(day: number | null, m: number, y: number) {
    if (!day) return false;
    const d = String(day).padStart(2, "0");
    const mo = String(m + 1).padStart(2, "0");
    return holidaySet.has(`${y}-${mo}-${d}`);
  }

  const calCells: { day: number | null; month: number; year: number; prevNext: boolean }[] = useMemo(() => {
    const offset   = getMonday(calYear, calMonth);
    const total    = daysInMonth(calYear, calMonth);
    const prevDays = daysInMonth(calYear, calMonth - 1);
    const cells: typeof calCells = [];

    for (let i = 0; i < offset; i++) {
      cells.push({ day: prevDays - offset + 1 + i, month: calMonth - 1 < 0 ? 11 : calMonth - 1, year: calMonth - 1 < 0 ? calYear - 1 : calYear, prevNext: true });
    }
    for (let d = 1; d <= total; d++) {
      cells.push({ day: d, month: calMonth, year: calYear, prevNext: false });
    }
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, month: calMonth + 1 > 11 ? 0 : calMonth + 1, year: calMonth + 1 > 11 ? calYear + 1 : calYear, prevNext: true });
    }
    return cells;
  }, [calMonth, calYear]);

  /* ── upcoming holidays ────────────────────────────────────────── */
  const upcomingHolidays = useMemo(() =>
    HOLIDAYS
      .filter(h => h.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8),
    [todayStr]
  );

  function formatHolidayDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  /* ══ render ═══════════════════════════════════════════════════════ */
  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5] font-sans overflow-hidden">
      <Header title="Leave Request" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* ── top action bar ─────────────────────────────────── */}
          <div className="flex justify-end mb-4">
            <button
              data-testid="button-apply-leave"
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#033c59" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#022d45")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#033c59")}
            >
              <Plus className="h-4 w-4" />
              Apply Leave
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ══ Left: main section ═══════════════════════════════ */}
            <div className="lg:col-span-2 space-y-4">

              {/* Search + filters */}
              <Card className="p-4 bg-white border-none shadow-sm rounded-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      data-testid="input-search-leave"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search by Leave ID or Type..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="relative">
                    <button
                      data-testid="button-status-filter"
                      onClick={() => { setStatusOpen(p => !p); setTypeOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 min-w-[130px] justify-between"
                    >
                      <span className="text-gray-700">{statusFilter}</span>
                      <ChevronRight className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", statusOpen && "rotate-90")} />
                    </button>
                    {statusOpen && (
                      <div className="absolute z-20 top-full mt-1 left-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {["All Status", "Approved", "Pending", "Rejected"].map(s => (
                          <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50",
                              statusFilter === s ? "font-semibold text-blue-600" : "text-gray-700"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Type filter */}
                  <div className="relative">
                    <button
                      data-testid="button-type-filter"
                      onClick={() => { setTypeOpen(p => !p); setStatusOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 min-w-[130px] justify-between"
                    >
                      <span className="text-gray-700">{typeFilter}</span>
                      <ChevronRight className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", typeOpen && "rotate-90")} />
                    </button>
                    {typeOpen && (
                      <div className="absolute z-20 top-full mt-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {["All Types", ...LEAVE_TYPES].map(t => (
                          <button
                            key={t}
                            onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50",
                              typeFilter === t ? "font-semibold text-blue-600" : "text-gray-700"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Leave table */}
              <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-base">My Leave Requests</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: "#033c59" }}>
                        {["Leave Type","Start Date","End Date","Days","Status","Applied Date","Comments"].map(h => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-white tracking-wide whitespace-nowrap"
                          >
                            {h.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                            No leave requests found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((l, idx) => (
                          <tr
                            key={l.id}
                            data-testid={`row-leave-${l.id}`}
                            className={cn("border-b border-gray-50 hover:bg-gray-50 transition-colors", idx % 2 === 1 && "bg-gray-50/40")}
                          >
                            <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{l.type}</td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDisplay(l.startDate)}</td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDisplay(l.endDate)}</td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">{l.days}</td>
                            <td className="px-4 py-3">
                              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", STATUS_STYLES[l.status])}>
                                {l.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDisplay(l.appliedDate)}</td>
                            <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{l.comments || "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ══ Right: calendar + legend + holidays ══════════════ */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-white border-none shadow-sm rounded-xl">

                {/* Month nav */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setCalDate(new Date(calYear, calMonth - 1))}
                    className="p-0.5 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <h3 className="font-bold text-gray-800 text-sm" style={{ color: "#033c59" }}>
                    {MONTHS[calMonth]} {calYear}
                  </h3>
                  <button
                    onClick={() => setCalDate(new Date(calYear, calMonth + 1))}
                    className="p-0.5 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-0.5">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                    <div
                      key={i}
                      className="text-center text-[10px] font-semibold text-gray-400 py-0.5 rounded"
                      style={i >= 5 ? { backgroundColor: "#EEEEEE" } : {}}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-0.5 mb-4">
                  {calCells.map((cell, idx) => {
                    const colIdx = idx % 7;
                    const weekend = colIdx >= 5;
                    const todayCell    = !cell.prevNext && isToday(cell.day, cell.month, cell.year);
                    const holidayCell  = !cell.prevNext && isHolidayDay(cell.day, cell.month, cell.year);

                    /* Sat/Sun always #EEEEEE */
                    if (weekend) {
                      return (
                        <div
                          key={idx}
                          className="aspect-square flex items-center justify-center text-[11px] rounded"
                          style={{ backgroundColor: "#EEEEEE", color: cell.prevNext ? "#bbb" : "#888" }}
                        >
                          {cell.day}
                        </div>
                      );
                    }

                    let bg = "";
                    let textColor = cell.prevNext ? "#bbb" : "#374151";
                    let fontBold = false;

                    if (todayCell)   { bg = "#00AEEF"; textColor = "#fff"; fontBold = true; }
                    else if (holidayCell) { bg = "#F59E0B"; textColor = "#fff"; fontBold = true; }

                    return (
                      <div
                        key={idx}
                        className={cn("aspect-square flex items-center justify-center text-[11px] rounded")}
                        style={{
                          backgroundColor: bg || "transparent",
                          color: textColor,
                          fontWeight: fontBold ? 700 : 400,
                        }}
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>

                {/* Status Legend */}
                <div className="mb-4">
                  <p className="font-semibold text-xs text-gray-600 mb-2">Status Legend</p>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                    {[
                      { label: "Approved", color: "#22c55e", count: approved },
                      { label: "Rejected", color: "#ef4444", count: rejected },
                      { label: "Pending",  color: "#f59e0b", count: pending  },
                    ].map(({ label, color, count }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs text-gray-600">{label}</span>
                        <span className="text-xs font-semibold text-gray-500 ml-auto">({count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Holidays */}
                <div>
                  <p className="font-semibold text-xs text-gray-600 mb-2">
                    Upcoming Holidays ({calYear})
                  </p>
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-0.5">
                    {upcomingHolidays.length === 0 ? (
                      <p className="text-xs text-gray-400">No upcoming holidays.</p>
                    ) : upcomingHolidays.map(h => (
                      <div key={h.date} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#F59E0B" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 leading-tight">{h.name}</p>
                          <p className="text-[11px] text-gray-400">{formatHolidayDate(h.date)}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded"
                            style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                            {h.tag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* ══ Apply Leave Modal ═══════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#033c59" }}>
              <h2 className="text-white font-bold text-base">Apply Leave</h2>
              <button
                onClick={closeModal}
                data-testid="button-close-modal"
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {modalErr && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                  {modalErr}
                </div>
              )}

              {/* Leave Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    data-testid="button-modal-type"
                    onClick={() => setTypeDropOpen(p => !p)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
                  >
                    <span className={fType ? "text-gray-800" : "text-gray-400"}>
                      {fType || "Select leave type"}
                    </span>
                    <ChevronRight className={cn("h-4 w-4 text-gray-400 transition-transform", typeDropOpen && "rotate-90")} />
                  </button>
                  {typeDropOpen && (
                    <div className="absolute z-30 top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                      {LEAVE_TYPES.map(t => (
                        <button
                          key={t}
                          onClick={() => { setFType(t); setTypeDropOpen(false); setModalErr(""); }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                            fType === t ? "font-semibold text-blue-600" : "text-gray-700"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="input-start-date"
                    type="date"
                    value={fStart}
                    onChange={e => { setFStart(e.target.value); setModalErr(""); }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="input-end-date"
                    type="date"
                    value={fEnd}
                    min={fStart}
                    onChange={e => { setFEnd(e.target.value); setModalErr(""); }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Days preview */}
              {fStart && fEnd && fEnd >= fStart && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#EFF6FF" }}>
                  <span className="text-blue-600 font-semibold">{calcDays(fStart, fEnd)} working day(s)</span>
                  <span className="text-blue-400">will be applied</span>
                </div>
              )}

              {/* Comments */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Comments / Reason
                </label>
                <textarea
                  data-testid="input-comments"
                  value={fComments}
                  onChange={e => setFComments(e.target.value)}
                  placeholder="Add a reason or notes (optional)..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                data-testid="button-cancel-leave"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="button-submit-leave"
                onClick={submitLeave}
                className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
                style={{ backgroundColor: "#033c59" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#022d45")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#033c59")}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
