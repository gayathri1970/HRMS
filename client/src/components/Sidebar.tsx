import logoUrl from "@assets/novintix_1773119222458.jpeg";
import { User, Briefcase, FileText, ClipboardList, Monitor, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const handleLogout = () => setLocation("/");

  return (
    <aside className="w-20 bg-white min-h-[calc(100vh-4rem)] flex flex-col items-center py-6 gap-8 border-r border-gray-200 shadow-sm relative">
      <Link href="/profile">
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", location === "/profile" ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
          <div className={cn("p-2 rounded-lg", location === "/profile" ? "bg-[#003B5C]/10" : "group-hover:bg-[#003B5C]/5")}>
            <User className={cn("h-6 w-6", location === "/profile" ? "text-[#003B5C]" : "text-gray-500 group-hover:text-[#003B5C]")} />
          </div>
          <span className={cn("text-[10px] font-semibold uppercase tracking-tighter text-center leading-none", location === "/profile" ? "text-[#003B5C]" : "text-gray-400 group-hover:text-[#003B5C]")}>Profile</span>
        </div>
      </Link>

      <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
        <Briefcase className="h-6 w-6 text-[#003B5C]" />
        <span className="text-[10px] text-[#003B5C] font-medium uppercase tracking-tighter text-center leading-none">Timesheet</span>
      </div>

      <Link href="/leave-request">
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", location === "/leave-request" ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
          <div className={cn("p-2 rounded-lg", location === "/leave-request" ? "bg-[#003B5C]/10" : "group-hover:bg-[#003B5C]/5")}>
            <ClipboardList className={cn("h-6 w-6", location === "/leave-request" ? "text-[#003B5C]" : "text-gray-500 group-hover:text-[#003B5C]")} />
          </div>
          <span className={cn("text-[10px] font-semibold uppercase tracking-tighter text-center leading-none", location === "/leave-request" ? "text-[#003B5C]" : "text-gray-400 group-hover:text-[#003B5C]")}>Leave Request</span>
        </div>
      </Link>

      <Link href="/asset-request">
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", location === "/asset-request" ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
          <div className={cn("p-2 rounded-lg", location === "/asset-request" ? "bg-[#003B5C]/10" : "group-hover:bg-[#003B5C]/5")}>
            <Monitor className={cn("h-6 w-6", location === "/asset-request" ? "text-[#003B5C]" : "text-gray-500 group-hover:text-[#003B5C]")} />
          </div>
          <span className={cn("text-[10px] font-semibold uppercase tracking-tighter text-center leading-none", location === "/asset-request" ? "text-[#003B5C]" : "text-gray-400 group-hover:text-[#003B5C]")}>Asset Request</span>
        </div>
      </Link>

      <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
        <FileText className="h-6 w-6 text-[#003B5C]" />
        <span className="text-[10px] text-[#003B5C] font-medium uppercase tracking-tighter leading-none">Policy</span>
      </div>

      <div className="mt-auto pb-6">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 border-2 border-[#003B5C]/20 shadow-sm">
                <AvatarFallback className="bg-[#003B5C] text-white font-bold text-xs">GP</AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-56 p-0 mb-2 ml-2 border border-gray-100 shadow-xl rounded-xl overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-100">
              <p className="font-bold text-sm text-gray-900">Gayathri Palani</p>
              <p className="text-xs text-gray-500">AI Intern</p>
            </div>
            <div className="p-1 bg-white">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}
