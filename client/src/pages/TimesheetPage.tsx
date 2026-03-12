import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const CLIENT_OPTIONS = ["Novintix"];
const PROJECT_OPTIONS = ["Internship", "Internal", "AI Internal"];

type WeekStatus = "none" | "draft" | "submitted";

interface Project {
  id: string;
  client: string;
  name: string;
  hours: number[];
}

interface WeekData {
  projects: Project[];
  status: WeekStatus;
}

function weekKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return d;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TimesheetPage() {
  const [today] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [weekDataMap, setWeekDataMap] = useState<Record<string, WeekData>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [calDate, setCalDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth()));

  const curKey = weekKey(weekStart);
  const weekEnd = (() => { const e = new Date(weekStart); e.setDate(e.getDate() + 6); return e; })();
  const curWeek: WeekData = weekDataMap[curKey] ?? { projects: [], status: "none" };
  const projects = curWeek.projects;
  const isSubmitted = curWeek.status === "submitted";

  const prevWeek = () => setWeekStart(ws => { const d = new Date(ws); d.setDate(d.getDate() - 7); return getMonday(d); });
  const nextWeek = () => setWeekStart(ws => { const d = new Date(ws); d.setDate(d.getDate() + 7); return getMonday(d); });

  const patchWeek = (patch: Partial<WeekData>) =>
    setWeekDataMap(m => ({ ...m, [curKey]: { ...curWeek, ...patch } }));

  const closeModal = () => { setSelectedClient(""); setSelectedProject(""); setShowAddModal(false); };

  const handleAddProject = () => {
    if (!selectedClient || !selectedProject) return;
    patchWeek({ projects: [...projects, { id: Date.now().toString(), client: selectedClient, name: selectedProject, hours: Array(7).fill(0) }] });
    closeModal();
  };

  const updateHours = (id: string, dayIdx: number, val: number) => {
    if (isSubmitted) return;
    patchWeek({ projects: projects.map(p => p.id === id ? { ...p, hours: p.hours.map((h, i) => i === dayIdx ? val : h) } : p) });
  };

  const clearRow = (id: string) => {
    if (isSubmitted) return;
    patchWeek({ projects: projects.map(p => p.id === id ? { ...p, hours: Array(7).fill(0) } : p) });
  };

  const handleSave = () => patchWeek({ status: "draft" });
  const handleSubmit = () => patchWeek({ status: "submitted" });

  const dayTotals = Array.from({ length: 7 }, (_, i) => projects.reduce((s, p) => s + p.hours[i], 0));
  const grandTotal = dayTotals.reduce((s, h) => s + h, 0);
  const rowTotal = (p: Project) => p.hours.reduce((s, h) => s + h, 0);

  const submittedDays = Object.values(weekDataMap).filter(w => w.status === "submitted").length * 7;
  const draftDays = Object.values(weekDataMap).filter(w => w.status === "draft").length * 7;

  const calMonth = calDate.getMonth();
  const calYear = calDate.getFullYear();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const calCells: (number | null)[] = [...Array(firstDayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isInSubmittedWeek = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    return Object.entries(weekDataMap).some(([k, wd]) => {
      if (wd.status !== "submitted") return false;
      const [y, mo, dt] = k.split("-").map(Number);
      const ws = new Date(y, mo, dt);
      const we = new Date(ws); we.setDate(we.getDate() + 6);
      return d >= ws && d <= we;
    });
  };

  const isInDraftWeek = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    return Object.entries(weekDataMap).some(([k, wd]) => {
      if (wd.status !== "draft") return false;
      const [y, mo, dt] = k.split("-").map(Number);
      const ws = new Date(y, mo, dt);
      const we = new Date(ws); we.setDate(we.getDate() + 6);
      return d >= ws && d <= we;
    });
  };

  const isToday = (day: number) => day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
  const isSatOrSun = (cellIdx: number) => cellIdx % 7 === 5 || cellIdx % 7 === 6;

  const fmtLabel = (d: Date) => `${DAYS[(d.getDay() + 6) % 7]}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}'${String(d.getFullYear()).slice(-2)}`;

  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5] font-sans overflow-hidden">
      <Header title="Timesheet" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Only the content area scrolls */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ══ Timesheet card ══ */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white border-none shadow-sm rounded-xl">

                {/* Week selector */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <button onClick={prevWeek} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {fmtLabel(weekStart)} &ndash; {fmtLabel(weekEnd)}
                      </span>
                    </div>
                    <button onClick={nextWeek} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <Button
                    className="gap-2 text-white text-sm"
                    style={{ backgroundColor: "#033c59" }}
                    onClick={() => setShowAddModal(true)}
                    disabled={isSubmitted}
                  >
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {/* Table — always rendered so Total Hours row is always visible */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-white rounded-tl-lg"
                            style={{ backgroundColor: "#033c59" }}>
                          Project Name
                        </th>
                        {DAYS.map((day, idx) => {
                          const d = new Date(weekStart);
                          d.setDate(d.getDate() + idx);
                          return (
                            <th key={day} className="text-center py-3 px-2 font-semibold text-white text-xs whitespace-nowrap"
                                style={{ backgroundColor: "#033c59" }}>
                              {day} {MONTHS[d.getMonth()].slice(0, 3)} {d.getDate()}
                            </th>
                          );
                        })}
                        <th className="text-center py-3 px-2 font-semibold text-white text-xs"
                            style={{ backgroundColor: "#033c59" }}>
                          Total
                        </th>
                        <th className="py-3 px-2 text-center font-semibold text-white text-xs rounded-tr-lg"
                            style={{ backgroundColor: "#033c59" }}>
                          Clear
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Empty state row — shown only when no projects */}
                      {projects.length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-10 text-center">
                            <p className="text-gray-500">No time sheets found for this week range</p>
                            <p className="text-gray-400 text-sm mt-1">Click "Add Project" to create a timesheet entry</p>
                          </td>
                        </tr>
                      )}

                      {/* Project rows */}
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 bg-gray-50 align-middle">
                            <div className="font-semibold text-gray-800">{project.name}</div>
                            {curWeek.status === "draft" && (
                              <div className="text-xs text-blue-500 mt-0.5">Draft</div>
                            )}
                          </td>
                          {project.hours.map((hours, dayIdx) => (
                            <td key={dayIdx} className="text-center py-3 px-2 align-middle">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={hours === 0 ? "" : String(hours)}
                                placeholder="0"
                                readOnly={isSubmitted}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value) || 0;
                                  updateHours(project.id, dayIdx, v);
                                }}
                                className={cn(
                                  "w-11 px-1 py-1 text-center text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-400",
                                  isSubmitted
                                    ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                                    : "border-gray-300 bg-white"
                                )}
                              />
                            </td>
                          ))}
                          <td className="text-center py-3 px-2 font-bold text-gray-700 align-middle">
                            {rowTotal(project)}
                          </td>
                          <td className="text-center py-3 px-2 align-middle">
                            <button
                              onClick={() => clearRow(project.id)}
                              disabled={isSubmitted}
                              title="Clear all hours"
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded border transition-colors",
                                isSubmitted
                                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                                  : "text-red-500 border-red-300 hover:bg-red-50"
                              )}
                            >
                              Clear
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Total Hours row — always visible */}
                      <tr className="bg-gray-100 font-bold text-gray-800">
                        <td className="py-3 px-4">Total Hours</td>
                        {dayTotals.map((t, i) => (
                          <td key={i} className="text-center py-3 px-2">{t}</td>
                        ))}
                        <td className="text-center py-3 px-2">{grandTotal}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action buttons — always visible, disabled when no entries or submitted */}
                <div className="flex justify-end gap-3 mt-5">
                  <Button
                    variant="outline"
                    className="px-6"
                    onClick={handleSave}
                    disabled={projects.length === 0 || isSubmitted}
                  >
                    Save Draft
                  </Button>
                  <Button
                    className="px-6 text-white"
                    style={{ backgroundColor: "#033c59" }}
                    onClick={handleSubmit}
                    disabled={projects.length === 0 || isSubmitted}
                  >
                    Submit Timesheet
                  </Button>
                </div>

                {isSubmitted && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-sm text-amber-800 font-medium">
                      This week has been submitted and it can not be edited.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* ══ Calendar panel — compact ══ */}
            <div className="lg:col-span-1">
              <Card className="p-3 bg-white border-none shadow-sm rounded-xl">

                {/* Month nav */}
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => setCalDate(new Date(calYear, calMonth - 1))} className="p-0.5 hover:bg-gray-100 rounded">
                    <ChevronLeft className="h-3 w-3 text-gray-500" />
                  </button>
                  <h3 className="font-semibold text-gray-700 text-xs">{MONTHS[calMonth]} {calYear}</h3>
                  <button onClick={() => setCalDate(new Date(calYear, calMonth + 1))} className="p-0.5 hover:bg-gray-100 rounded">
                    <ChevronRight className="h-3 w-3 text-gray-500" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-px mb-px">
                  {["M","T","W","T","F","S","S"].map((d, i) => (
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
                <div className="grid grid-cols-7 gap-px mb-3">
                  {calCells.map((day, idx) => {
                    const weekend = isSatOrSun(idx);
                    if (weekend) {
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-center text-[10px] rounded text-gray-400 h-6"
                          style={{ backgroundColor: "#EEEEEE" }}
                        >
                          {day}
                        </div>
                      );
                    }

                    const todayCell = day !== null && isToday(day);
                    const submittedCell = day !== null && isInSubmittedWeek(day);
                    const draftCell = day !== null && !submittedCell && isInDraftWeek(day);

                    let bg = "";
                    let textCls = "text-gray-700";
                    let fontBold = false;

                    if (todayCell) { bg = "#00AEEF"; textCls = "text-white"; fontBold = true; }
                    else if (submittedCell) { bg = "#F59E0B"; textCls = "text-white"; fontBold = true; }
                    else if (draftCell) { bg = "#93C5FD"; textCls = "text-white"; fontBold = true; }

                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-center text-[10px] rounded transition-colors h-6",
                          !bg && day !== null && "hover:bg-gray-100 cursor-pointer",
                          textCls,
                          fontBold && "font-bold"
                        )}
                        style={bg ? { backgroundColor: bg } : {}}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {/* Status Legend */}
                <div className="space-y-1 border-t border-gray-100 pt-2">
                  <p className="font-semibold text-gray-700 text-[10px] mb-1.5">Status Legend</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-green-500 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Approved</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">0</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-red-500 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Rejected</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">0</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-amber-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Submitted</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">{submittedDays}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-blue-300 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Draft</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">{draftDays}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* ══ Add Project Modal ══ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white border-none shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "#033c59" }}>Add New Project</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Client</Label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a client…</option>
                  {CLIENT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Project Name</Label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a project…</option>
                  {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddProject}
                disabled={!selectedClient || !selectedProject}
                className="flex-1 text-white disabled:opacity-50"
                style={{ backgroundColor: "#033c59" }}
              >
                Add Project
              </Button>
              <Button variant="outline" className="flex-1" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
