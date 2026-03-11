import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const clientOptions = ["Novintix"];
const projectNameOptions = ["Internship", "Internal", "AI Internal"];

interface Project {
  id: string;
  client: string;
  name: string;
  hours: number[];
  savedDays: boolean[]; // per-day lock
}

interface WeekData {
  projects: Project[];
  submitted: boolean;
}

export default function TimesheetPage() {
  const [weekStart, setWeekStart] = useState(new Date(2026, 2, 2));
  const [weekDataMap, setWeekDataMap] = useState<Record<string, WeekData>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 2));
  const [today] = useState(new Date(2026, 2, 11));

  /* ─── helpers ─────────────────────────────────────────────── */

  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    return d;
  };

  const weekKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const currentWeekKey = weekKey(weekStart);

  const weekEnd = (() => {
    const e = new Date(weekStart);
    e.setDate(e.getDate() + 6);
    return e;
  })();

  const currentWeekData: WeekData =
    weekDataMap[currentWeekKey] ?? { projects: [], submitted: false };

  const projects = currentWeekData.projects;
  const isSubmitted = currentWeekData.submitted;

  /* ─── navigation ───────────────────────────────────────────── */

  const prevWeek = () =>
    setWeekStart((ws) => {
      const d = new Date(ws);
      d.setDate(d.getDate() - 7);
      return getMonday(d);
    });

  const nextWeek = () =>
    setWeekStart((ws) => {
      const d = new Date(ws);
      d.setDate(d.getDate() + 7);
      return getMonday(d);
    });

  /* ─── project mutations ────────────────────────────────────── */

  const updateWeek = (data: Partial<WeekData>) =>
    setWeekDataMap((m) => ({
      ...m,
      [currentWeekKey]: { ...currentWeekData, ...data },
    }));

  const handleAddProject = () => {
    if (!selectedClient || !selectedProjectName) return;
    const newProject: Project = {
      id: Date.now().toString(),
      client: selectedClient,
      name: selectedProjectName,
      hours: [0, 0, 0, 0, 0, 0, 0],
      savedDays: [false, false, false, false, false, false, false],
    };
    updateWeek({ projects: [...projects, newProject] });
    setSelectedClient("");
    setSelectedProjectName("");
    setShowAddModal(false);
  };

  const updateHours = (projectId: string, dayIdx: number, val: number) => {
    if (isSubmitted) return;
    updateWeek({
      projects: projects.map((p) =>
        p.id === projectId && !p.savedDays[dayIdx]
          ? { ...p, hours: p.hours.map((h, i) => (i === dayIdx ? val : h)) }
          : p
      ),
    });
  };

  const clearHour = (projectId: string, dayIdx: number) => {
    if (isSubmitted) return;
    updateWeek({
      projects: projects.map((p) =>
        p.id === projectId && !p.savedDays[dayIdx]
          ? { ...p, hours: p.hours.map((h, i) => (i === dayIdx ? 0 : h)) }
          : p
      ),
    });
  };

  const deleteProject = (projectId: string) => {
    if (isSubmitted) return;
    updateWeek({ projects: projects.filter((p) => p.id !== projectId) });
  };

  /* Save: lock only cells that have hours entered (> 0) */
  const handleSave = () => {
    updateWeek({
      projects: projects.map((p) => ({
        ...p,
        savedDays: p.savedDays.map((saved, i) => saved || p.hours[i] > 0),
      })),
    });
  };

  /* Submit: lock all cells + mark week submitted */
  const handleSubmit = () => {
    updateWeek({
      submitted: true,
      projects: projects.map((p) => ({
        ...p,
        savedDays: [true, true, true, true, true, true, true],
      })),
    });
  };

  /* ─── totals ───────────────────────────────────────────────── */

  const dayTotals = Array.from({ length: 7 }, (_, i) =>
    projects.reduce((s, p) => s + (p.hours[i] || 0), 0)
  );
  const grandTotal = dayTotals.reduce((s, h) => s + h, 0);

  const projectTotal = (p: Project) => p.hours.reduce((s, h) => s + h, 0);

  /* ─── calendar ─────────────────────────────────────────────── */

  const calMonth = calendarDate.getMonth();
  const calYear = calendarDate.getFullYear();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayRaw = new Date(calYear, calMonth, 1).getDay();
  // convert Sun=0 → Mon=0 grid
  const firstDayOffset = (firstDayRaw + 6) % 7;

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isInSubmittedWeek = (day: number): boolean => {
    const d = new Date(calYear, calMonth, day);
    return Object.entries(weekDataMap).some(([k, wd]) => {
      if (!wd.submitted) return false;
      const [y, mo, dt] = k.split("-").map(Number);
      const ws = new Date(y, mo, dt);
      const we = new Date(ws);
      we.setDate(we.getDate() + 6);
      return d >= ws && d <= we;
    });
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  /* ─── render ───────────────────────────────────────────────── */

  const fmtWeekLabel = (d: Date) =>
    `${days[(d.getDay() + 6) % 7]}, ${d.getDate()} ${months[d.getMonth()].slice(0, 3)}'${String(d.getFullYear()).slice(-2)}`;

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <Header title="Timesheet" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Timesheet card ── */}
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
                        {fmtWeekLabel(weekStart)} &ndash; {fmtWeekLabel(weekEnd)}
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

                {/* Empty state */}
                {projects.length === 0 ? (
                  <div className="text-center py-14">
                    <p className="text-gray-500">No time sheets found for this week range</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Add Project" to create a timesheet entry</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {/* Project Name header */}
                          <th
                            className="text-left py-3 px-4 font-semibold text-white rounded-tl-lg"
                            style={{ backgroundColor: "#033c59" }}
                          >
                            Project Name
                          </th>

                          {/* Day-date headers */}
                          {days.map((day, idx) => {
                            const d = new Date(weekStart);
                            d.setDate(d.getDate() + idx);
                            return (
                              <th
                                key={day}
                                className="text-center py-3 px-2 font-semibold text-white text-xs whitespace-nowrap"
                                style={{ backgroundColor: "#033c59" }}
                              >
                                {day} {months[d.getMonth()].slice(0, 3)} {d.getDate()}
                              </th>
                            );
                          })}

                          <th
                            className="text-center py-3 px-2 font-semibold text-white text-xs"
                            style={{ backgroundColor: "#033c59" }}
                          >
                            Total
                          </th>
                          <th
                            className="py-3 px-2 rounded-tr-lg"
                            style={{ backgroundColor: "#033c59" }}
                          />
                        </tr>
                      </thead>

                      <tbody>
                        {projects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                            {/* Project name cell */}
                            <td className="py-3 px-4 bg-gray-50 align-middle">
                              <div className="font-semibold text-gray-800">{project.name}</div>
                            </td>

                            {/* Hour input cells */}
                            {project.hours.map((hours, dayIdx) => {
                              const locked = project.savedDays[dayIdx] || isSubmitted;
                              return (
                                <td key={dayIdx} className="text-center py-3 px-1 align-middle">
                                  <div className="flex items-center justify-center gap-0.5">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={hours === 0 ? "" : String(hours)}
                                      placeholder="0"
                                      readOnly={locked}
                                      onChange={(e) => {
                                        const v = parseInt(e.target.value) || 0;
                                        updateHours(project.id, dayIdx, v);
                                      }}
                                      className={cn(
                                        "w-10 px-1 py-1 text-center text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-400",
                                        locked
                                          ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                                          : "border-gray-300 bg-white"
                                      )}
                                    />
                                    {/* Clear button — disabled only after submit */}
                                    <button
                                      onClick={() => clearHour(project.id, dayIdx)}
                                      disabled={isSubmitted}
                                      title="Clear"
                                      className={cn(
                                        "text-xs leading-none px-0.5 py-0.5 rounded transition-colors",
                                        isSubmitted
                                          ? "text-gray-300 cursor-not-allowed"
                                          : "text-gray-400 hover:text-red-500"
                                      )}
                                    >
                                      ×
                                    </button>
                                  </div>
                                </td>
                              );
                            })}

                            {/* Row total */}
                            <td className="text-center py-3 px-2 font-bold text-gray-700 align-middle">
                              {projectTotal(project)}
                            </td>

                            {/* Delete row — disabled after submit */}
                            <td className="text-center py-3 px-2 align-middle">
                              <button
                                onClick={() => deleteProject(project.id)}
                                disabled={isSubmitted}
                                title="Remove"
                                className={cn(
                                  "text-lg leading-none transition-colors",
                                  isSubmitted
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-400 hover:text-red-600"
                                )}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Totals row */}
                        <tr className="bg-gray-100 font-bold text-gray-800">
                          <td className="py-3 px-4">Total Hours</td>
                          {dayTotals.map((t, i) => (
                            <td key={i} className="text-center py-3 px-2">
                              {t}
                            </td>
                          ))}
                          <td className="text-center py-3 px-2">{grandTotal}</td>
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Action buttons */}
                {projects.length > 0 && (
                  <div className="flex justify-end gap-3 mt-5">
                    <Button
                      variant="outline"
                      className="px-6"
                      onClick={handleSave}
                      disabled={isSubmitted}
                    >
                      Save
                    </Button>
                    <Button
                      className="px-6 text-white"
                      style={{ backgroundColor: "#033c59" }}
                      onClick={handleSubmit}
                      disabled={isSubmitted}
                    >
                      Submit Timesheet
                    </Button>
                  </div>
                )}

                {isSubmitted && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-sm text-amber-800 font-medium">
                      This week has been submitted and is now locked.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* ── Calendar panel ── */}
            <div className="lg:col-span-1">
              <Card className="p-5 bg-white border-none shadow-sm rounded-xl">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCalendarDate(new Date(calYear, calMonth - 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {months[calMonth]} {calYear}
                  </h3>
                  <button
                    onClick={() => setCalendarDate(new Date(calYear, calMonth + 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <div key={d} className="text-center text-xs font-bold text-gray-500 py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {calendarCells.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square flex items-center justify-center text-xs rounded transition-colors",
                        !day
                          ? ""
                          : isToday(day)
                          ? "bg-[#00AEEF] text-white font-bold"
                          : isInSubmittedWeek(day)
                          ? "bg-amber-400 text-white font-bold"
                          : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-gray-800 text-sm mb-2">Status Legend</p>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#00AEEF] inline-block" />
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="text-gray-600">Submitted</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* ── Add Project Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white border-none shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "#033c59" }}>
                Add New Project
              </h2>
              <button
                onClick={() => { setSelectedClient(""); setSelectedProjectName(""); setShowAddModal(false); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Client dropdown */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Client</Label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a client…</option>
                  {clientOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Project Name dropdown */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Project Name</Label>
                <select
                  value={selectedProjectName}
                  onChange={(e) => setSelectedProjectName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a project…</option>
                  {projectNameOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddProject}
                disabled={!selectedClient || !selectedProjectName}
                className="flex-1 text-white disabled:opacity-50"
                style={{ backgroundColor: "#033c59" }}
              >
                Add Project
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setSelectedClient(""); setSelectedProjectName(""); setShowAddModal(false); }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
