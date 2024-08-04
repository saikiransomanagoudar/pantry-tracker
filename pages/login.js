import { FcGoogle } from "react-icons/fc";
import React, { useEffect } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/firebase/firebase_api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";

const provider = new GoogleAuthProvider();

const LoginForm = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const { authUser, isLoading } = useAuth();

  const router = useRouter();

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-credential":
        return "Incorrect email or password. Please try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const loginHandler = async () => {
    setError("");
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", user);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    // if (!name || !email || !password) return;
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [isLoading, authUser]);

  return isLoading || (!isLoading && authUser) ? (
    <Spinner />
  ) : (
    <main className="flex lg:h-[100vh]">
      <div className="w-full lg:w-[60%] p-8 md:p-14 flex flex-col items-center justify-center lg:justify-start">
        <h1 className="text-3xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg shadow-md mb-6">
          Pantry Tracker
        </h1>
        <div className="p-8 w-full flex flex-col items-center">
          <h2 className="text-6xl font-semibold">Login</h2>
          <p className="mt-6">
            Don't have an account?{" "}
            <Link
              href={"/register"}
              className="underline hover:text-blue-400 cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
          {error && <div className="text-red-500">{error}</div>}
          <div
            onClick={signInWithGoogle}
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active: scale-80 flex justify-center items-center gap-4 cursor-pointer"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-black group-hover:text-white">
              Login with Google
            </span>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col items-center"
          >
            <div className="mt-10 w-full">
              <label>Email</label>
              <input
                type="email"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400 w-full"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-10 w-full">
              <label>Password</label>
              <input
                type="password"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400 w-full"
                required
                autoComplete="on"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              onClick={loginHandler}
              className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[60%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
        style={{ backgroundImage: "url('/image.jpg')" }}
      ></div>
    </main>
  );
};

export default LoginForm;
