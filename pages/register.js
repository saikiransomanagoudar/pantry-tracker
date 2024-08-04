import { FcGoogle } from "react-icons/fc";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase_api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Spinner from "@/components/Spinner";
import { Router, useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";

const provider = new GoogleAuthProvider();

const RegisterForm = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const { authUser, isLoading, setAuthUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [isLoading, authUser, router]);

  const signUpHandler = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName: name });
      setAuthUser({
        uid: user.uid,
        email: user.email,
        name,
      });
      console.log("User created:", user);
    } catch (error) {
      console.error(error);
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

  return isLoading || (!isLoading && authUser) ? (
    <Spinner />
  ) : (
    <main className="flex lg:h-[100vh]">
      <div className="w-full lg:w-[60%] p-8 md:p-14 flex flex-col items-center justify-center lg:justify-start">
        <h1 className="text-3xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg shadow-md mb-6">
          Pantry Tracker
        </h1>
        <div className="w-full flex flex-col items-center">
          <h2 className="text-6xl font-semibold">Sign Up</h2>
          <p className="mt-6">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="underline hover:text-blue-400 cursor-pointer"
            >
              Login
            </Link>
          </p>
          {error && <div className="text-red-500">{error}</div>}
          <div
            onClick={signInWithGoogle}
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-80 flex justify-center items-center gap-4 cursor-pointer"
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
              <label>Name</label>
              <input
                type="text"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400 w-full"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              onClick={signUpHandler}
              className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
            >
              Sign Up
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

export default RegisterForm;
