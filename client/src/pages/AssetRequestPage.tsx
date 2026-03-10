import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AssetRequestPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <Header title="Asset Request" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Asset Request</h1>
          <p className="text-gray-500">Asset request management content will go here.</p>
        </main>
      </div>
    </div>
  );
}
