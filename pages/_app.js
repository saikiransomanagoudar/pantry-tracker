import { AuthUserProvider, useAuth } from "@/firebase/auth";
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

// const { authUser, isLoading } = useAuth();

// useEffect(() => {
//   if (!isLoading && authUser) {
//     router.push("/");  // Redirect to home if authenticated
//   }
// }, [isLoading, authUser, router]);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pantry Tracker</title>
      </Head>
      <AuthUserProvider>
        <Component {...pageProps} />;
      </AuthUserProvider>
    </>
  );
}
