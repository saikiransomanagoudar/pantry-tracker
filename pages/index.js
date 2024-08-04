import { GoSignOut } from "react-icons/go";

export default function Home() {
  return (
    <main>
      <div
        className="bg-slate-600 text-white w-44 py-4 mt-5 rounded-lg 
      transition-transform hover:bg-black/[0.8] active:scale-90 
      flex items-center justify-center gap-2 font:medium 
      shadow-md fixed bottom-90 right-5 cursor-pointer"
      >
        <GoSignOut size={15} />
        <span>Logout</span>
      </div>
    </main>
  );
}
