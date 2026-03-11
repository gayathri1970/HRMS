import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function TimesheetPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 2)); // March 2, 2026
  const [projects, setProjects] = useState([
    {
      name: "AI - Internal",
      hours: [9, 9, 9, 9, 9, 0, 0],
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

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

  const weekStartDate = new Date(currentYear, currentMonth, 2);
  const weekEndDate = new Date(currentYear, currentMonth, 8);

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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Mon, {weekStartDate.getDate()} Mar 26 - Sun, {weekEndDate.getDate()} Mar 26
                      </span>
                    </div>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <Button className="bg-[#6B8BA8] hover:bg-[#5A7799] text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {/* Timesheet Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-800">Project Name</th>
                        {days.map((day) => (
                          <th key={day} className="text-center py-3 px-2 font-bold text-gray-800 text-sm">
                            {day}
                          </th>
                        ))}
                        <th className="text-center py-3 px-2 font-bold text-gray-800 text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700 bg-gray-50">
                            {project.name}
                          </td>
                          {project.hours.map((hours, dayIdx) => (
                            <td key={dayIdx} className="text-center py-4 px-2">
                              <input
                                type="number"
                                value={hours}
                                onChange={(e) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].hours[dayIdx] = parseInt(e.target.value) || 0;
                                  setProjects(newProjects);
                                }}
                                className="w-12 px-2 py-1 text-center text-sm border border-gray-200 rounded"
                              />
                            </td>
                          ))}
                          <td className="text-center py-4 px-2 font-bold text-gray-700">
                            {getTotalHours(project.hours)}
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
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" className="px-6">Save</Button>
                  <Button className="bg-[#6B8BA8] hover:bg-[#5A7799] text-white px-6">Submit Timesheet</Button>
                </div>
              </Card>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white border-none shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <h3 className="font-bold text-gray-800">
                    {months[currentMonth]} {currentYear}
                  </h3>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded",
                        day === null
                          ? ""
                          : day === 2
                          ? "bg-[#00AEEF] text-white font-bold"
                          : day === 3
                          ? "bg-[#00AEEF] text-white font-bold"
                          : day === 4
                          ? "bg-[#00AEEF] text-white font-bold"
                          : day === 5
                          ? "bg-[#00AEEF] text-white font-bold"
                          : day === 6
                          ? "bg-[#00AEEF] text-white font-bold"
                          : "text-gray-700"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                    <span className="text-gray-700">Approved (14)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-gray-700">Submitted (0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Rejected (0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                    <span className="text-gray-700">Draft (0)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
