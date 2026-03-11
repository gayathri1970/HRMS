import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Project {
  id: string;
  name: string;
  task: string;
  description: string;
  hours: number[];
}

export default function TimesheetPage() {
  const [weekStart, setWeekStart] = useState(new Date(2026, 2, 2)); // March 2, 2026 (Monday)
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectTask, setNewProjectTask] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
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

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        task: newProjectTask,
        description: newProjectDescription,
        hours: [0, 0, 0, 0, 0, 0, 0],
      };
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setNewProjectTask("");
      setNewProjectDescription("");
      setShowAddModal(false);
    }
  };

  const resetModal = () => {
    setNewProjectName("");
    setNewProjectTask("");
    setNewProjectDescription("");
    setShowAddModal(false);
  };

  const updateProjectHours = (projectId: string, dayIndex: number, hours: number) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, hours: project.hours.map((h, i) => i === dayIndex ? hours : h) }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
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
                    <div className="flex items-center gap-2 min-w-[250px]">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </span>
                    </div>
                    <button onClick={nextWeek} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <Button 
                    className="bg-[#6B8BA8] hover:bg-[#5A7799] text-white gap-2"
                    onClick={() => setShowAddModal(true)}
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
                          {days.map((day, idx) => (
                            <th key={day} className="text-center py-3 px-2 font-bold text-gray-800 text-sm">
                              <div>{day}</div>
                              <div className="text-xs font-normal text-gray-500">
                                {new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </th>
                          ))}
                          <th className="text-center py-3 px-2 font-bold text-gray-800 text-sm">Total</th>
                          <th className="text-center py-3 px-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm bg-gray-50">
                              <div className="font-bold text-gray-800">{project.name}</div>
                              <div className="text-xs text-gray-600 mt-1">{project.task}</div>
                              {project.description && <div className="text-xs text-gray-500 mt-1">{project.description}</div>}
                            </td>
                            {project.hours.map((hours, dayIdx) => (
                              <td key={dayIdx} className="text-center py-4 px-2">
                                <input
                                  type="number"
                                  value={hours}
                                  onChange={(e) => updateProjectHours(project.id, dayIdx, parseInt(e.target.value) || 0)}
                                  className="w-12 px-2 py-1 text-center text-sm border border-gray-200 rounded"
                                />
                              </td>
                            ))}
                            <td className="text-center py-4 px-2 font-bold text-gray-700">
                              {getTotalHours(project.hours)}
                            </td>
                            <td className="text-center py-4 px-2">
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
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
                    <Button variant="outline" className="px-6">Save</Button>
                    <Button className="bg-[#6B8BA8] hover:bg-[#5A7799] text-white px-6">Submit Timesheet</Button>
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
                          : [2, 3, 4, 5, 6].includes(day)
                          ? "bg-[#00AEEF] text-white font-bold cursor-pointer hover:bg-[#0099D8]"
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
                    <span className="text-gray-700">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-gray-700">Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                    <span className="text-gray-700">Draft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Rejected</span>
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
              <h2 className="text-lg font-bold text-gray-800">Add Project</h2>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project-task" className="text-sm font-medium text-gray-700">
                  Task
                </Label>
                <Input
                  id="project-task"
                  value={newProjectTask}
                  onChange={(e) => setNewProjectTask(e.target.value)}
                  placeholder="Enter task description..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project-description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddProject}
                className="flex-1 bg-[#00AEEF] hover:bg-[#0099D8] text-white"
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
