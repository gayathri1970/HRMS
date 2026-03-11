import { User, Briefcase, FileText, ClipboardList, Monitor } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-20 bg-white min-h-[calc(100vh-4rem)] flex flex-col items-center py-6 gap-8 border-r border-gray-200 shadow-sm">
      <Link href="/profile">
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", location === "/profile" ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
          <div className={cn("p-2 rounded-lg", location === "/profile" ? "bg-[#003B5C]/10" : "group-hover:bg-[#003B5C]/5")}>
            <User className={cn("h-6 w-6", location === "/profile" ? "text-[#003B5C]" : "text-gray-500 group-hover:text-[#003B5C]")} />
          </div>
          <span className={cn("text-[10px] font-semibold uppercase tracking-tighter text-center leading-none", location === "/profile" ? "text-[#003B5C]" : "text-gray-400 group-hover:text-[#003B5C]")}>Profile</span>
        </div>
      </Link>

      <Link href="/timesheet">
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", location === "/timesheet" ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
          <div className={cn("p-2 rounded-lg", location === "/timesheet" ? "bg-[#003B5C]/10" : "group-hover:bg-[#003B5C]/5")}>
            <Briefcase className={cn("h-6 w-6", location === "/timesheet" ? "text-[#003B5C]" : "text-gray-500 group-hover:text-[#003B5C]")} />
          </div>
          <span className={cn("text-[10px] font-semibold uppercase tracking-tighter text-center leading-none", location === "/timesheet" ? "text-[#003B5C]" : "text-gray-400 group-hover:text-[#003B5C]")}>Timesheet</span>
        </div>
      </Link>

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
    </aside>
  );
}
