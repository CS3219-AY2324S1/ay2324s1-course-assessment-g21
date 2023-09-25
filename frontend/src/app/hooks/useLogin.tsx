"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, redirect to the desired page
        router.push("/admin/question"); // Replace with your desired destination
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
};

export default useLogin;
