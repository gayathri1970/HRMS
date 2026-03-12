import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, FileText, Upload, Download, Plus, Pencil, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const STORAGE_KEY = "profileData";

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || "-"}</p>
    </div>
  );
}

function SectionInput({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled || readOnly}
        className={disabled || readOnly ? "bg-gray-50 text-gray-500" : ""}
      />
      {readOnly && <p className="text-[10px] text-gray-400 mt-0.5 italic">Read-only</p>}
    </div>
  );
}

function SectionSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
        {label}
      </Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function ProfilePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [editBasic, setEditBasic] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editFamily, setEditFamily] = useState(false);
  const [editIdDocs, setEditIdDocs] = useState(false);
  const [editBanking, setEditBanking] = useState(false);
  const [editPassport, setEditPassport] = useState(false);
  const [editInsurance, setEditInsurance] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", percentage: "" });

  const [skills, setSkills] = useState<{ name: string; percentage: string }[]>([]);
  const [basicDetails, setBasicDetails] = useState({
    employeeId: "GP001",
    firstName: "Gayathri",
    lastName: "Palani",
    dateOfJoining: "2025-02-02",
    nationality: "Indian",
    religion: "Hindu",
    maritalStatus: "Single",
  });
  const [contactInfo, setContactInfo] = useState({
    mobileNumber: "7695838187",
    officialEmail: "gayathri@novintix.com",
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
  const [familyInfo, setFamilyInfo] = useState({
    spouseName: "",
    spouseRole: "",
    spouseOrganization: "",
    numberOfChildren: "",
  });
  const [professionalDocs, setProfessionalDocs] = useState<{
    relieving: File | null;
    experience: File | null;
  }>({ relieving: null, experience: null });
  const [idDocs, setIdDocs] = useState({
    nationalIdType: "",
    nationalIdNumber: "",
    taxIdType: "",
    taxIdNumber: "",
  });
  const [banking, setBanking] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
  });
  const [passport, setPassport] = useState({
    hasPassport: "No",
    passportNumber: "",
    passportExpiry: "",
  });
  const [insurance, setInsurance] = useState({
    policyNumber: "",
    memberId: "",
  });
  const [education, setEducation] = useState({
    highestLevel: "",
    institution: "",
    yearOfPassing: "",
    specialization: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const d = JSON.parse(stored);
      if (d.basicDetails) setBasicDetails(d.basicDetails);
      if (d.contactInfo) setContactInfo(d.contactInfo);
      if (d.aboutText) setAboutText(d.aboutText);
      if (d.addressInfo) setAddressInfo(d.addressInfo);
      if (d.familyInfo) setFamilyInfo(d.familyInfo);
      if (d.skills) setSkills(d.skills);
      if (d.idDocs) setIdDocs(d.idDocs);
      if (d.banking) setBanking(d.banking);
      if (d.passport) setPassport(d.passport);
      if (d.insurance) setInsurance(d.insurance);
      if (d.education) setEducation(d.education);
    }
  }, []);

  const persist = (overrides: Record<string, unknown> = {}) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        basicDetails,
        contactInfo,
        aboutText,
        addressInfo,
        familyInfo,
        skills,
        idDocs,
        banking,
        passport,
        insurance,
        education,
        ...overrides,
      })
    );
  };

  const handleUploadClick = () => document.getElementById("resume-upload")?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };
  const handleDownload = () => {
    if (!uploadedFile) return;
    const url = URL.createObjectURL(uploadedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = uploadedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProfDocUpload = (type: "relieving" | "experience") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setProfessionalDocs((prev) => ({ ...prev, [type]: file }));
    };
    input.click();
  };

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.percentage) return;
    const updated = [...skills, newSkill];
    setSkills(updated);
    setNewSkill({ name: "", percentage: "" });
    setShowAddSkill(false);
    persist({ skills: updated });
  };
  const handleRemoveSkill = (i: number) => {
    const updated = skills.filter((_, idx) => idx !== i);
    setSkills(updated);
    persist({ skills: updated });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5] font-sans overflow-hidden">
      <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
      <Header title="Profile" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Only the content area scrolls — sidebar stays fixed */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* CSS columns masonry: cards fill columns top-to-bottom, no empty space */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">

            {/* ── Profile Card ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="overflow-hidden border-none shadow-sm rounded-xl bg-white">
                <div className="h-20 bg-[#00AEEF]" />
                <div className="px-6 pb-7 -mt-10 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg mb-3">
                    <AvatarFallback className="bg-gray-100 text-gray-400">
                      <User className="h-14 w-14" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-bold text-gray-900">
                    {basicDetails.firstName} {basicDetails.lastName}
                  </h2>
                  <span className="mt-1.5 inline-block bg-[#E1F5FE] text-[#00AEEF] text-xs font-semibold px-3 py-0.5 rounded-full">
                    AI Intern
                  </span>
                </div>
              </Card>
            </div>

            {/* ── Basic Details ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Basic Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditBasic(!editBasic)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editBasic ? (
                  <div className="space-y-3">
                    <SectionInput label="Employee ID" value={basicDetails.employeeId} disabled />
                    <SectionInput label="First Name" value={basicDetails.firstName} onChange={(v) => setBasicDetails({ ...basicDetails, firstName: v })} />
                    <SectionInput label="Last Name" value={basicDetails.lastName} onChange={(v) => setBasicDetails({ ...basicDetails, lastName: v })} />
                    <SectionInput label="Date of Joining" type="date" value={basicDetails.dateOfJoining} disabled />
                    <SectionSelect label="Nationality" value={basicDetails.nationality} onChange={(v) => setBasicDetails({ ...basicDetails, nationality: v })} options={["Indian", "American", "British", "Other"]} />
                    <SectionSelect label="Religion" value={basicDetails.religion} onChange={(v) => setBasicDetails({ ...basicDetails, religion: v })} options={["Hindu", "Muslim", "Christian", "Other"]} />
                    <SectionSelect label="Marital Status" value={basicDetails.maritalStatus} onChange={(v) => setBasicDetails({ ...basicDetails, maritalStatus: v })} options={["Single", "Married"]} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ basicDetails }); setEditBasic(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditBasic(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Employee ID" value={basicDetails.employeeId} />
                    <FieldRow label="First Name" value={basicDetails.firstName} />
                    <FieldRow label="Last Name" value={basicDetails.lastName} />
                    <FieldRow label="Date of Joining" value={basicDetails.dateOfJoining} />
                    <FieldRow label="Nationality" value={basicDetails.nationality} />
                    <FieldRow label="Religion" value={basicDetails.religion} />
                    <FieldRow label="Marital Status" value={basicDetails.maritalStatus} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Address Details ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Address Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditAddress(!editAddress)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editAddress ? (
                  <div className="space-y-3">
                    <SectionInput label="Address" value={addressInfo.address} onChange={(v) => setAddressInfo({ ...addressInfo, address: v })} />
                    <SectionInput label="City" value={addressInfo.city} onChange={(v) => setAddressInfo({ ...addressInfo, city: v })} />
                    <SectionInput label="State" value={addressInfo.state} onChange={(v) => setAddressInfo({ ...addressInfo, state: v })} />
                    <SectionInput label="Pincode" value={addressInfo.pincode} onChange={(v) => setAddressInfo({ ...addressInfo, pincode: v })} />
                    <SectionInput label="Country" value={addressInfo.country} onChange={(v) => setAddressInfo({ ...addressInfo, country: v })} />
                    <SectionInput label="Work Location" value={addressInfo.workLocation} onChange={(v) => setAddressInfo({ ...addressInfo, workLocation: v })} />
                    <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] w-full" onClick={() => { persist({ addressInfo }); setEditAddress(false); }}>Save</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Address" value={addressInfo.address} />
                    <FieldRow label="City" value={addressInfo.city} />
                    <FieldRow label="State" value={addressInfo.state} />
                    <FieldRow label="Pincode" value={addressInfo.pincode} />
                    <FieldRow label="Country" value={addressInfo.country} />
                    <FieldRow label="Work Location" value={addressInfo.workLocation} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Resume ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E1F5FE] rounded-lg">
                    <FileText className="h-4 w-4 text-[#00AEEF]" />
                  </div>
                  <span className="font-semibold text-sm text-gray-800">Resume</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", uploadedFile ? "text-[#00AEEF] hover:text-[#003B5C]" : "text-gray-300 cursor-not-allowed")}
                    onClick={handleDownload}
                    disabled={!uploadedFile}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* ── Contact Information ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Contact Information</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditContact(!editContact)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editContact ? (
                  <div className="space-y-3">
                    <SectionInput label="Mobile Number" value={contactInfo.mobileNumber} onChange={(v) => setContactInfo({ ...contactInfo, mobileNumber: v })} />
                    <SectionInput label="Official Email ID" value={contactInfo.officialEmail} readOnly />
                    <SectionInput label="Personal Email ID" type="email" value={contactInfo.personalEmail} onChange={(v) => setContactInfo({ ...contactInfo, personalEmail: v })} />
                    <SectionInput label="Emergency Contact" value={contactInfo.emergencyContact} onChange={(v) => setContactInfo({ ...contactInfo, emergencyContact: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ contactInfo }); setEditContact(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditContact(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Mobile Number" value={contactInfo.mobileNumber} />
                    <FieldRow label="Official Email ID" value={contactInfo.officialEmail} />
                    <FieldRow label="Personal Email ID" value={contactInfo.personalEmail} />
                    <FieldRow label="Emergency Contact" value={contactInfo.emergencyContact} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Skills & Expertise ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Skills & Expertise</h3>
                  <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] h-7 text-xs gap-1 px-2" onClick={() => setShowAddSkill(!showAddSkill)}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
                {showAddSkill && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <SectionInput label="Skill Name" value={newSkill.name} onChange={(v) => setNewSkill({ ...newSkill, name: v })} />
                    <SectionInput label="Proficiency (%)" type="number" value={newSkill.percentage} onChange={(v) => setNewSkill({ ...newSkill, percentage: v })} />
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={handleAddSkill}>Add</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowAddSkill(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {skills.length === 0 ? (
                    <p className="text-sm text-gray-400">No skills added yet.</p>
                  ) : (
                    skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{skill.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-[#00AEEF] h-1.5 rounded-full" style={{ width: `${Math.min(+skill.percentage, 100)}%` }} />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{skill.percentage}%</p>
                        </div>
                        <button onClick={() => handleRemoveSkill(i)} className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                          <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* ── Identification Documents ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Identification Documents</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditIdDocs(!editIdDocs)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editIdDocs ? (
                  <div className="space-y-3">
                    <SectionSelect label="National ID Card Type" value={idDocs.nationalIdType || "Aadhaar"} onChange={(v) => setIdDocs({ ...idDocs, nationalIdType: v })} options={["Aadhaar", "PAN", "Voter ID", "Driving License"]} />
                    <SectionInput label="National ID Upload" value="Read-only" readOnly />
                    <SectionInput label="National Identity Number" value={idDocs.nationalIdNumber} onChange={(v) => setIdDocs({ ...idDocs, nationalIdNumber: v })} />
                    <SectionSelect label="Tax Identification Card Type" value={idDocs.taxIdType || "PAN"} onChange={(v) => setIdDocs({ ...idDocs, taxIdType: v })} options={["PAN", "TAN", "GSTIN"]} />
                    <SectionInput label="Tax ID Upload" value="Read-only" readOnly />
                    <SectionInput label="Tax Identification Number" value={idDocs.taxIdNumber} onChange={(v) => setIdDocs({ ...idDocs, taxIdNumber: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ idDocs }); setEditIdDocs(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditIdDocs(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="National Identity Card Type" value={idDocs.nationalIdType} />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">National ID Upload</p>
                      <p className="text-xs text-gray-400 italic">Read-only</p>
                    </div>
                    <FieldRow label="National Identity Number" value={idDocs.nationalIdNumber} />
                    <FieldRow label="Tax Identification Card Type" value={idDocs.taxIdType} />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Tax ID Upload</p>
                      <p className="text-xs text-gray-400 italic">Read-only</p>
                    </div>
                    <FieldRow label="Tax Identification Number" value={idDocs.taxIdNumber} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── About Employee ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">About Employee</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditAbout(!editAbout)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editAbout ? (
                  <div className="space-y-3">
                    <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="Write about yourself..." className="resize-none min-h-[80px]" />
                    <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] w-full" onClick={() => { persist({ aboutText }); setEditAbout(false); }}>Save</Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">{aboutText || "No information provided yet."}</p>
                )}
              </Card>
            </div>

            {/* ── Banking Details ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Banking Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditBanking(!editBanking)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editBanking ? (
                  <div className="space-y-3">
                    <SectionInput label="Bank Name" value={banking.bankName} onChange={(v) => setBanking({ ...banking, bankName: v })} />
                    <SectionInput label="Account Number" value={banking.accountNumber} onChange={(v) => setBanking({ ...banking, accountNumber: v })} />
                    <SectionInput label="IFSC Code" value={banking.ifscCode} onChange={(v) => setBanking({ ...banking, ifscCode: v })} />
                    <SectionInput label="Branch" value={banking.branch} onChange={(v) => setBanking({ ...banking, branch: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ banking }); setEditBanking(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditBanking(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Bank Name" value={banking.bankName} />
                    <FieldRow label="Account Number" value={banking.accountNumber} />
                    <FieldRow label="IFSC Code" value={banking.ifscCode} />
                    <FieldRow label="Branch" value={banking.branch} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Professional Documents ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Professional Documents</h3>
                <div className="space-y-4">
                  {(["relieving", "experience"] as const).map((type) => (
                    <div key={type}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        {type === "relieving" ? "Relieving Certificate" : "Experience Certificate"}
                      </p>
                      <button
                        onClick={() => handleProfDocUpload(type)}
                        className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-500"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span className="text-xs">{professionalDocs[type] ? "Replace File" : "Upload"}</span>
                      </button>
                      {professionalDocs[type] && (
                        <p className="text-[10px] text-green-600 mt-1">✓ {professionalDocs[type]!.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ── Insurance / Policy Details ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Insurance / Policy Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditInsurance(!editInsurance)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editInsurance ? (
                  <div className="space-y-3">
                    <SectionInput label="Policy Number" value={insurance.policyNumber} onChange={(v) => setInsurance({ ...insurance, policyNumber: v })} />
                    <SectionInput label="Member ID" value={insurance.memberId} onChange={(v) => setInsurance({ ...insurance, memberId: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ insurance }); setEditInsurance(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditInsurance(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Policy Number" value={insurance.policyNumber} />
                    <FieldRow label="Member ID" value={insurance.memberId} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Family Information ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Family Information</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditFamily(!editFamily)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editFamily ? (
                  <div className="space-y-3">
                    <SectionInput label="Spouse Name" value={familyInfo.spouseName} onChange={(v) => setFamilyInfo({ ...familyInfo, spouseName: v })} />
                    <SectionInput label="Spouse Employment Role" value={familyInfo.spouseRole} onChange={(v) => setFamilyInfo({ ...familyInfo, spouseRole: v })} />
                    <SectionInput label="Spouse Organization" value={familyInfo.spouseOrganization} onChange={(v) => setFamilyInfo({ ...familyInfo, spouseOrganization: v })} />
                    <SectionInput label="Number of Children" type="number" value={familyInfo.numberOfChildren} onChange={(v) => setFamilyInfo({ ...familyInfo, numberOfChildren: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ familyInfo }); setEditFamily(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditFamily(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Spouse Name" value={familyInfo.spouseName} />
                    <FieldRow label="Spouse Employment Role" value={familyInfo.spouseRole} />
                    <FieldRow label="Spouse Organization" value={familyInfo.spouseOrganization} />
                    <FieldRow label="Number of Children" value={familyInfo.numberOfChildren} />
                  </div>
                )}
              </Card>
            </div>

            {/* ── Passport Details ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Passport Details</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditPassport(!editPassport)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editPassport ? (
                  <div className="space-y-3">
                    <SectionSelect label="Do you have passport?" value={passport.hasPassport} onChange={(v) => setPassport({ ...passport, hasPassport: v })} options={["No", "Yes"]} />
                    {passport.hasPassport === "Yes" && (
                      <>
                        <SectionInput label="Passport Number" value={passport.passportNumber} onChange={(v) => setPassport({ ...passport, passportNumber: v })} />
                        <SectionInput label="Passport Expiry" type="date" value={passport.passportExpiry} onChange={(v) => setPassport({ ...passport, passportExpiry: v })} />
                      </>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ passport }); setEditPassport(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditPassport(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Do you have passport?" value={passport.hasPassport} />
                    {passport.hasPassport === "Yes" && (
                      <>
                        <FieldRow label="Passport Number" value={passport.passportNumber} />
                        <FieldRow label="Passport Expiry" value={passport.passportExpiry} />
                      </>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* ── Education Documents ── */}
            <div className="break-inside-avoid mb-4">
              <Card className="p-5 border-none shadow-sm rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Education Documents</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#00AEEF]" onClick={() => setEditEducation(!editEducation)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {editEducation ? (
                  <div className="space-y-3">
                    <SectionSelect
                      label="Highest Level of Education"
                      value={education.highestLevel || "Select"}
                      onChange={(v) => setEducation({ ...education, highestLevel: v })}
                      options={["Select", "High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"]}
                    />
                    <SectionInput label="Institution" value={education.institution} onChange={(v) => setEducation({ ...education, institution: v })} />
                    <SectionInput label="Year of Passing" type="number" value={education.yearOfPassing} onChange={(v) => setEducation({ ...education, yearOfPassing: v })} />
                    <SectionInput label="Specialization" value={education.specialization} onChange={(v) => setEducation({ ...education, specialization: v })} />
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="bg-[#00AEEF] hover:bg-[#003B5C] flex-1" onClick={() => { persist({ education }); setEditEducation(false); }}>Save</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditEducation(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FieldRow label="Highest Level of Education" value={education.highestLevel} />
                    <FieldRow label="Institution" value={education.institution} />
                    <FieldRow label="Year of Passing" value={education.yearOfPassing} />
                    <FieldRow label="Specialization" value={education.specialization} />
                  </div>
                )}
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
