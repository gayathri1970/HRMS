import logoUrl from "@assets/novintix_1773119222458.jpeg";

export default function Header({ title }: { title: string }) {
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
    </header>
  );
}
