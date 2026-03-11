import logoUrl from "@assets/novintix_1773119222458.jpeg";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export default function Header({ title }: { title: string }) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [location, setLocation] = useLocation();

  const handleLogout = () => setLocation("/");

  return (
    <header className="bg-[#003B5C] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-4 h-full">
        <div className="h-full flex items-center">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-10 w-10 rounded-sm bg-white object-contain"
          />
        </div>
        <h1 className="text-xl font-semibold tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 border-2 border-white/20 shadow-sm">
                <AvatarImage src={profilePhoto || ""} />
                <AvatarFallback className="bg-white text-[#003B5C] font-bold">
                  GP
                </AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-56 p-0 border-none shadow-xl rounded-xl overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-100">
              <p className="font-bold text-sm text-gray-900">Gayathri Palani</p>
              <p className="text-xs text-gray-500">AI Intern</p>
            </div>
            <div className="p-1 bg-white">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
