import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  FileText,
  Upload,
  Download,
  Plus,
  Pencil,
} from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [location, setLocation] = useLocation();

  // Edit mode states
  const [editingBasicDetails, setEditingBasicDetails] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingEducation, setEditingEducation] = useState(false);

  // Form data states
  const [basicDetails, setBasicDetails] = useState({
    employeeId: "GP001",
    firstName: "Gayathri",
    lastName: "Palani",
    dateOfBirth: "2004-07-19",
    dateOfJoining: "2025-02-02",
    nationality: "Indian",
    religion: "Hindu",
    maritalStatus: "Single",
  });
  const [contactInfo, setContactInfo] = useState({
    mobileNumber: "7695838187",
    personalEmail: "gayathrips1970@gmail.com",
    emergencyContact: "9942745200",
  });
  const [aboutText, setAboutText] = useState("");
  const [addressInfo, setAddressInfo] = useState({
    address: "Narasingapuram, Thuraiyur",
    city: "Tiruchirappalli",
    state: "TamilNadu",
    country: "India",
    pincode: "621008",
    workLocation: "Coimbatore",
  });

  const handleUploadClick = () => {
    document.getElementById("resume-upload")?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const handleDownloadClick = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      <Header title="Profile" />

      <div className="flex">
        <Sidebar />

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
                <h2 className="text-xl font-bold text-gray-900">
                  {basicDetails.firstName} {basicDetails.lastName}
                </h2>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-colors",
                    uploadedFile
                      ? "text-[#00AEEF] hover:text-[#003B5C]"
                      : "text-gray-400 cursor-not-allowed",
                  )}
                  onClick={handleDownloadClick}
                  disabled={!uploadedFile}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Basic Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Basic Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                  onClick={() => setEditingBasicDetails(!editingBasicDetails)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {editingBasicDetails ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Employee ID
                    </Label>
                    <Input
                      value={basicDetails.employeeId}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          employeeId: e.target.value,
                        })
                      }
                      placeholder="Enter Employee ID"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      First Name
                    </Label>
                    <Input
                      value={basicDetails.firstName}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Last Name
                    </Label>
                    <Input
                      value={basicDetails.lastName}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Enter Last Name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Date of Joining
                    </Label>
                    <Input
                      type="date"
                      value={basicDetails.dateOfJoining}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          dateOfJoining: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Nationality
                    </Label>
                    <Input
                      value={basicDetails.nationality}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          nationality: e.target.value,
                        })
                      }
                      placeholder="Enter Nationality"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      value={basicDetails.dateOfBirth}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Marital Status
                    </Label>
                    <Input
                      value={basicDetails.maritalStatus}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          maritalStatus: e.target.value,
                        })
                      }
                      placeholder="Enter Marital Status"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Religion
                    </Label>
                    <Input
                      value={basicDetails.religion}
                      onChange={(e) =>
                        setBasicDetails({
                          ...basicDetails,
                          religion: e.target.value,
                        })
                      }
                      placeholder="Enter Religion"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1"
                      onClick={() => setEditingBasicDetails(false)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingBasicDetails(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-4 text-xs">
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Employee ID</p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.employeeId || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">First Name</p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.firstName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Last Name</p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.lastName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Date of Joining
                    </p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.dateOfJoining || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Nationality</p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.nationality || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Date of Birth
                    </p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.dateOfBirth || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Marital Status
                    </p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.maritalStatus || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Religion</p>
                    <p className="font-medium text-gray-700">
                      {basicDetails.religion || "-"}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Contact Information */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Contact Information</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                  onClick={() => setEditingContactInfo(!editingContactInfo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {editingContactInfo ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Mobile Number
                    </Label>
                    <Input
                      value={contactInfo.mobileNumber}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          mobileNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Personal Email ID
                    </Label>
                    <Input
                      type="email"
                      value={contactInfo.personalEmail}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          personalEmail: e.target.value,
                        })
                      }
                      placeholder="Enter Email"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">
                      Emergency Contact
                    </Label>
                    <Input
                      value={contactInfo.emergencyContact}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          emergencyContact: e.target.value,
                        })
                      }
                      placeholder="Enter Emergency Contact"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1"
                      onClick={() => setEditingContactInfo(false)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingContactInfo(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Mobile Number
                    </p>
                    <p className="font-medium text-gray-700">
                      {contactInfo.mobileNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Personal Email ID
                    </p>
                    <p className="font-medium text-gray-700">
                      {contactInfo.personalEmail || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">
                      Emergency Contact
                    </p>
                    <p className="font-medium text-gray-700">
                      {contactInfo.emergencyContact || "-"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* About Employee */}
            <Card className="p-6 border-none shadow-sm rounded-xl flex flex-col min-h-[12rem]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">About Employee</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                  onClick={() => setEditingAbout(!editingAbout)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {editingAbout ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <Textarea 
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Write about yourself..."
                    className="flex-1 min-h-[8rem] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1"
                      onClick={() => setEditingAbout(false)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  {aboutText || "No information provided yet."}
                </p>
              )}
            </Card>

            {/* Address Details */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Address Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                  onClick={() => setEditingAddress(!editingAddress)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {editingAddress ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">Address</Label>
                    <Input 
                      value={addressInfo.address}
                      onChange={(e) => setAddressInfo({...addressInfo, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase mb-2 block text-gray-400">City</Label>
                      <Input 
                        value={addressInfo.city}
                        onChange={(e) => setAddressInfo({...addressInfo, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase mb-2 block text-gray-400">State</Label>
                      <Input 
                        value={addressInfo.state}
                        onChange={(e) => setAddressInfo({...addressInfo, state: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase mb-2 block text-gray-400">Pincode</Label>
                      <Input 
                        value={addressInfo.pincode}
                        onChange={(e) => setAddressInfo({...addressInfo, pincode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase mb-2 block text-gray-400">Country</Label>
                      <Input 
                        value={addressInfo.country}
                        onChange={(e) => setAddressInfo({...addressInfo, country: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase mb-2 block text-gray-400">Work Location</Label>
                    <Input 
                      value={addressInfo.workLocation}
                      onChange={(e) => setAddressInfo({...addressInfo, workLocation: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1"
                      onClick={() => setEditingAddress(false)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-6 text-xs">
                  <div className="col-span-2">
                    <p className="text-gray-400 uppercase mb-1">Address</p>
                    <p className="font-medium text-gray-700">{addressInfo.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">City</p>
                    <p className="font-medium text-gray-700">{addressInfo.city || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">State</p>
                    <p className="font-medium text-gray-700">{addressInfo.state || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Pin Code</p>
                    <p className="font-medium text-gray-700">{addressInfo.pincode || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase mb-1">Country</p>
                    <p className="font-medium text-gray-700">{addressInfo.country || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 uppercase mb-1">Work Location</p>
                    <p className="font-medium text-gray-700">{addressInfo.workLocation || "-"}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Identification Documents */}
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">
                Identification Documents
              </h3>
              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    National Identity Card Type
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    National ID Upload
                  </p>
                  <p className="text-gray-400 italic">Read-only</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">
                    National Identity Number
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    Tax Identification Card Type
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">Tax ID Upload</p>
                  <p className="text-gray-400 italic">Read-only</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">
                    Tax Identification Number
                  </p>
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
                <Button
                  size="sm"
                  className="bg-[#00AEEF] hover:bg-[#003B5C] h-8 gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-6">
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
                  <p className="text-gray-400 uppercase mb-1">
                    Do you have passport?
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    Passport Number
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase mb-1">
                    Passport Expiry Date
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Full Width Row - Insurance/Policy */}
          <div className="lg:col-span-8">
            <Card className="p-6 border-none shadow-sm rounded-xl">
              <h3 className="font-bold text-gray-800 mb-6">
                Insurance / Policy Details
              </h3>
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
                  <p className="text-gray-400 uppercase mb-1">
                    Policy Start Date
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    Policy End Date
                  </p>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-6 text-xs">
                <div>
                  <p className="text-gray-400 uppercase mb-1">
                    Highest Level of Education
                  </p>
                  <p className="font-medium text-gray-700">-</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-400">
                    <Upload className="h-4 w-4" />
                    <span>Schooling Certificate</span>
                  </div>
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-400">
                    <Upload className="h-4 w-4" />
                    <span>UG Degree Certificate</span>
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
