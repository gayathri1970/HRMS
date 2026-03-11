import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Project {
  id: string;
  name: string;
  hours: number[];
  saved: boolean;
}

export default function TimesheetPage() {
  const [weekStart, setWeekStart] = useState(new Date(2026, 2, 2)); // March 2, 2026 (Monday)
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2));
  const [today] = useState(new Date(2026, 2, 11)); // March 11, 2026 (Wednesday)
  const [submittedWeeks, setSubmittedWeeks] = useState<string[]>([]);

  const projectNameOptions = ["Internship", "Internal", "AI Internal"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekKey = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  const prevWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(getMonday(newDate));
  };

  const nextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(getMonday(newDate));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getWeekEnd = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return end;
  };

  const weekEnd = getWeekEnd();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isWeekSubmitted = submittedWeeks.includes(getWeekKey(weekStart));

  const handleAddProject = () => {
    if (selectedProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: selectedProjectName,
        hours: [0, 0, 0, 0, 0, 0, 0],
        saved: false,
      };
      setProjects([...projects, newProject]);
      setSelectedProjectName("");
      setShowAddModal(false);
    }
  };

  const resetModal = () => {
    setSelectedProjectName("");
    setShowAddModal(false);
  };

  const updateProjectHours = (projectId: string, dayIndex: number, hours: number) => {
    if (!isWeekSubmitted) {
      setProjects(projects.map(project =>
        project.id === projectId && !project.saved
          ? { ...project, hours: project.hours.map((h, i) => i === dayIndex ? hours : h) }
          : project
      ));
    }
  };

  const deleteProject = (projectId: string) => {
    if (!isWeekSubmitted) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const saveProjects = () => {
    setProjects(projects.map(p => ({ ...p, saved: true })));
  };

  const submitTimesheet = () => {
    const weekKey = getWeekKey(weekStart);
    if (!submittedWeeks.includes(weekKey)) {
      setSubmittedWeeks([...submittedWeeks, weekKey]);
    }
  };

  const getTotalHours = (projectHours: number[]) => {
    return projectHours.reduce((sum, hours) => sum + hours, 0);
  };

  const getWeekTotals = () => {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    projects.forEach((project) => {
      project.hours.forEach((hour, index) => {
        totals[index] += hour;
      });
    });
    return totals;
  };

  const isDateInSubmittedWeek = (date: number): boolean => {
    const dateObj = new Date(currentYear, currentMonth, date);
    for (const weekKey of submittedWeeks) {
      const [year, month, dayOfMonth] = weekKey.split("-").map(Number);
      const weekStartDate = new Date(year, month, dayOfMonth);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      
      if (dateObj >= weekStartDate && dateObj <= weekEndDate) {
        return true;
      }
    }
    return false;
  };

  const weekTotals = getWeekTotals();
  const totalHoursAllProjects = getTotalHours(weekTotals);

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <Header title="Timesheet" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Timesheet */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white border-none shadow-sm rounded-xl">
                {/* Week Range Selector */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button onClick={prevWeek} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {days[(weekStart.getDay() + 6) % 7]}, {weekStart.getDate()} {months[weekStart.getMonth()].substring(0, 3)}&apos;{weekStart.getFullYear().toString().slice(-2)} - {days[(weekEnd.getDay() + 6) % 7]}, {weekEnd.getDate()} {months[weekEnd.getMonth()].substring(0, 3)}&apos;{weekEnd.getFullYear().toString().slice(-2)}
                      </span>
                    </div>
                    <button onClick={nextWeek} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <Button 
                    className="bg-[#033c59] hover:bg-[#022847] text-white gap-2"
                    onClick={() => setShowAddModal(true)}
                    disabled={isWeekSubmitted}
                  >
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {/* Timesheet Content */}
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No time sheets found for this week range</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Add Project" to create a timesheet entry</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Project Name</th>
                          {days.map((day, idx) => {
                            const dayDate = new Date(weekStart);
                            dayDate.setDate(dayDate.getDate() + idx);
                            return (
                              <th key={day} className="text-center py-3 px-2 font-bold text-gray-800 text-sm whitespace-nowrap">
                                {day} {months[dayDate.getMonth()].substring(0, 3)} {dayDate.getDate()}
                              </th>
                            );
                          })}
                          <th className="text-center py-3 px-2 font-bold text-gray-800 text-sm">Total</th>
                          <th className="text-center py-3 px-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project) => (
                          <tr key={project.id} className={`border-b border-gray-200 ${isWeekSubmitted ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                            <td className="py-4 px-4 text-sm bg-gray-50">
                              <div className="font-bold text-gray-800">{project.name}</div>
                              {project.saved && <div className="text-xs text-green-600 mt-1">Saved</div>}
                            </td>
                            {project.hours.map((hours, dayIdx) => (
                              <td key={dayIdx} className="text-center py-4 px-2">
                                <input
                                  type="number"
                                  value={hours}
                                  onChange={(e) => updateProjectHours(project.id, dayIdx, parseInt(e.target.value) || 0)}
                                  disabled={project.saved || isWeekSubmitted}
                                  className="w-12 px-2 py-1 text-center text-sm border border-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  style={{ MozAppearance: 'textfield' }}
                                />
                              </td>
                            ))}
                            <td className="text-center py-4 px-2 font-bold text-gray-700">
                              {getTotalHours(project.hours)}
                            </td>
                            <td className="text-center py-4 px-2">
                              <button
                                onClick={() => deleteProject(project.id)}
                                disabled={project.saved || isWeekSubmitted}
                                className={`transition-colors ${project.saved || isWeekSubmitted ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100">
                          <td className="py-3 px-4 font-bold text-gray-800">Total Hours</td>
                          {weekTotals.map((total, idx) => (
                            <td key={idx} className="text-center py-3 px-2 font-bold text-gray-800">
                              {total}
                            </td>
                          ))}
                          <td className="text-center py-3 px-2 font-bold text-gray-800">
                            {totalHoursAllProjects}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Action Buttons */}
                {projects.length > 0 && (
                  <div className="flex justify-end gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="px-6"
                      onClick={saveProjects}
                      disabled={isWeekSubmitted}
                    >
                      Save
                    </Button>
                    <Button 
                      className="bg-[#033c59] hover:bg-[#022847] text-white px-6"
                      onClick={submitTimesheet}
                      disabled={isWeekSubmitted}
                    >
                      Submit Timesheet
                    </Button>
                  </div>
                )}

                {isWeekSubmitted && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-sm text-amber-800 font-medium">This week has been submitted and is now locked.</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Calendar & Status Legend */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white border-none shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {months[currentMonth]} {currentYear}
                  </h3>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded transition-colors",
                        day === null
                          ? ""
                          : day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                          ? "bg-[#00AEEF] text-white font-bold cursor-pointer hover:bg-[#0099D8]"
                          : isDateInSubmittedWeek(day)
                          ? "bg-amber-400 text-white font-bold cursor-pointer hover:bg-amber-500"
                          : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Status Legend */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-gray-800 text-sm mb-3">Status Legend</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                    <span className="text-gray-700">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-gray-700">Submitted</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white border-none shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: '#033c59' }}>Add New Project</h2>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
                  Project Name
                </Label>
                <select
                  id="project-name"
                  value={selectedProjectName}
                  onChange={(e) => setSelectedProjectName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project...</option>
                  {projectNameOptions.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddProject}
                className="flex-1 text-white"
                style={{ backgroundColor: '#033c59' }}
              >
                Add Project
              </Button>
              <Button
                onClick={resetModal}
                variant="outline"
                className="flex-1"
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
