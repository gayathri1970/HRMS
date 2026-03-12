import { useState } from "react";
import { Plus, X, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface AssetRequest {
  id: string;
  assetType: string;
  reason: string;
  requestDate: string;
  status: string;
  comments: string;
}

const ASSET_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Headset",
  "Mobile Phone",
  "Tablet",
  "Printer",
  "Other",
];

export default function AssetRequestPage() {
  const [showModal, setShowModal] = useState(false);
  const [assetType, setAssetType] = useState("");
  const [reason, setReason] = useState("");
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);

  const myAssets: never[] = [];

  const totalAssets = myAssets.length;
  const activeAssets = myAssets.length;
  const pendingRequests = assetRequests.filter((r) => r.status === "Pending").length;

  const handleSubmit = () => {
    if (!assetType || !reason.trim()) return;
    const newRequest: AssetRequest = {
      id: Date.now().toString(),
      assetType,
      reason,
      requestDate: new Date().toLocaleDateString("en-GB"),
      status: "Pending",
      comments: "",
    };
    setAssetRequests([...assetRequests, newRequest]);
    setAssetType("");
    setReason("");
    setShowModal(false);
  };

  const handleCancel = () => {
    setAssetType("");
    setReason("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <Header title="Assets" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Page Title + Request Button */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Assets</h2>
              <p className="text-gray-500 text-sm mt-1">View assigned assets and request new ones</p>
            </div>
            <Button
              className="bg-[#003B5C] hover:bg-[#002A44] text-white gap-2 px-5"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" />
              Request Asset
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Total Assets
              </p>
              <p className="text-4xl font-bold text-gray-900 leading-none">{totalAssets}</p>
            </Card>
            <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Active
              </p>
              <p className="text-4xl font-bold text-gray-900 leading-none">{activeAssets}</p>
            </Card>
            <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Pending Requests
              </p>
              <p className="text-4xl font-bold text-gray-900 leading-none">{pendingRequests}</p>
            </Card>
          </div>

          {/* My Assets Table */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden mb-5">
            <table className="w-full">
              <thead>
                <tr className="bg-[#003B5C] text-white">
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Asset</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Serial Number</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Assigned Date</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {myAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      No assets assigned yet
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </Card>

          {/* My Asset Requests */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-white border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">My Asset Requests</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#003B5C] text-white">
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Asset Type</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Reason</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Request Date</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider">Comments</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {assetRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      No asset requests yet
                    </td>
                  </tr>
                ) : (
                  assetRequests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3.5 px-5 text-sm text-gray-700">{req.assetType}</td>
                      <td className="py-3.5 px-5 text-sm text-gray-700 max-w-xs truncate">{req.reason}</td>
                      <td className="py-3.5 px-5 text-sm text-gray-700">{req.requestDate}</td>
                      <td className="py-3.5 px-5">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-sm text-gray-400 italic">
                        {req.comments || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </main>
      </div>

      {/* Request Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E1F5FE] rounded-lg">
                  <Monitor className="h-5 w-5 text-[#003B5C]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Request Asset</h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
                  Asset Type <span className="text-red-500">*</span>
                </Label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent bg-white"
                >
                  <option value="">Select asset type...</option>
                  {ASSET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
                  Reason <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why you need this asset..."
                  className="resize-none h-28 text-sm"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} className="px-5">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!assetType || !reason.trim()}
                className="bg-[#003B5C] hover:bg-[#002A44] text-white px-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
