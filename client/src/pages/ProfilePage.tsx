import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Upload, 
  Download,
  Plus,
  Trash2,
  Globe,
  Heart,
  Shield,
  BookOpen,
  Users
} from "lucide-react";

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const logoUrl = "https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60";

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      {/* Header */}
      <header className="bg-[#003B5C] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4 h-full">
          <div className="h-full flex items-center">
            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-sm bg-white object-contain" />
          </div>
          <h1 className="text-xl font-semibold tracking-wide">Profile</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={profilePhoto || ""} />
            <AvatarFallback className="bg-white text-[#003B5C] font-bold">GP</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-20 bg-white min-h-[calc(100vh-4rem)] flex flex-col items-center py-6 gap-8 border-r border-gray-200 shadow-sm">
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="p-2 rounded-lg bg-[#003B5C]/10">
              <User className="h-6 w-6 text-[#003B5C]" />
            </div>
            <span className="text-[10px] text-[#003B5C] font-semibold uppercase tracking-tighter">Profile</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
            <Briefcase className="h-6 w-6 text-[#003B5C]" />
            <span className="text-[10px] text-[#003B5C] font-medium uppercase tracking-tighter">Timesheet</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
            <FileText className="h-6 w-6 text-[#003B5C]" />
            <span className="text-[10px] text-[#003B5C] font-medium uppercase tracking-tighter">Leaves</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Main Profile Card */}
            <Card className="overflow-hidden border-none shadow-sm rounded-xl">
              <div className="h-24 bg-[#00AEEF]"></div>
              <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg mb-4">
                  <AvatarImage src={profilePhoto || ""} />
                  <AvatarFallback className="bg-gray-100 text-gray-400 text-4xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900">Gayathri Palani</h2>
                <p className="text-[#00AEEF] bg-[#E1F5FE] px-4 py-1 rounded-full text-xs font-semibold mt-2">
                  AI Intern
                </p>
              </div>
            </Card>

            {/* Resume Section */}
            <Card className="p-6 border-none shadow-sm rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E1F5FE] rounded-lg">
                  <FileText className="h-5 w-5 text-[#00AEEF]" />
                </div>
                <span className="font-semibold text-gray-800">Resume</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]">
                  <Upload className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Basic Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Basic Details</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Employee ID</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">First Name</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Last Name</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Date of Joining</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Nationality</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Date of Birth</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Marital Status</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Religion</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Contact Information</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Mobile Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Personal Email ID</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Emergency Contact</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* About Employee */}
            <Card className="p-6 border-none shadow-sm rounded-xl flex flex-col h-48">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">About Employee</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 text-sm">-</p>
            </Card>

            {/* Address Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Address Details</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">Address</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">City</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">State</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Pin Code</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Country</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">Work Location</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>

            {/* Identification Documents */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">Identification Documents</h3>
              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">National Identity Card Type</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">National ID Upload</p>
                  <p className="text-gray-400 italic">Read-only</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">National Identity Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Tax Identification Card Type</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Tax ID Upload</p>
                  <p className="text-gray-400 italic">Read-only</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">Tax Identification Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Skills & Expertise */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Skills & Expertise</h3>
                <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-6">
                {/* Empty State or Skills placeholder */}
                <p className="text-gray-400 text-sm">No skills added yet</p>
              </div>
            </Card>

            {/* Banking Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">Banking Details</h3>
              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Bank Name</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Account Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Account Type</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">IFSC Code</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">SWIFT Code</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Branch Name</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>

            {/* Passport Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">Passport Details</h3>
              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Do you have passport?</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Passport Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">Passport Expiry Date</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Full Width Row - Insurance/Policy */}
          <div className="lg:col-span-8">
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">Insurance / Policy Details</h3>
              <div className="grid grid-cols-4 gap-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Policy Number</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Member ID</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Policy Start Date</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Policy End Date</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Education Documents */}
          <div className="lg:col-span-4">
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Education Documents</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">Highest Level of Education</p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Schooling Certificate</span>
                  </div>
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">UG Degree Certificate</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
}
