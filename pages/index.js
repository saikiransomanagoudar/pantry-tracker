import { GoSignOut } from "react-icons/go";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import Spinner from "@/components/Spinner";
import { useEffect } from "react";

export default function Home() {
  const { authUser, isLoading, signOut } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }
  }, [isLoading, authUser]);

  return !authUser ? <Spinner/> : (
    <main>
      <div
        className="bg-slate-600 text-white w-44 py-4 mt-5 rounded-lg 
      transition-transform hover:bg-black/[0.8] active:scale-90 
      flex items-center justify-center gap-2 font:medium 
      shadow-md fixed bottom-90 right-5 cursor-pointer"
      onClick={signOut}
      >
        <GoSignOut size={15} />
        <span>Logout</span>
      </div>
    </main>
  );
}
