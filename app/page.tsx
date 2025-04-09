"use client";
import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { Login } from "@/components/Login";
import Image from "next/image";
import { ClaimCoin } from "@/components/ClaimCoin";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [minikitAvailable, setMinikitAvailable] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let mounted = true;

    const checkMiniKit = async () => {
      try {
        const isInstalled = await MiniKit.isInstalled();
        if (mounted) {
          setMinikitAvailable(isInstalled);
          setIsLoading(false);
          if (!isInstalled) {
            timeoutId = setTimeout(checkMiniKit, 500);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error("MiniKit check failed:", error);
          setIsLoading(false);
        }
      }
    };

    checkMiniKit();

    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkUserLoggedIn();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleUserChange = (event: CustomEvent) => {
      setUser(event.detail.user);
    };

    window.addEventListener("userChange" as any, handleUserChange);

    return () => {
      window.removeEventListener("userChange" as any, handleUserChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-900">Loading MiniKit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {!user ? (
          <main className="rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
            <div className="space-y-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full p-2 shadow-lg">
                    <Image
                      src="/assets/logo.png"
                      alt="Astracoin Logo"
                      width={60}
                      height={60}
                      className="rounded-full"
                      priority
                    />
                  </div>
                </div>
                <h1 className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-3xl font-extrabold text-transparent">
                  Astracoin
                </h1>
                <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  {/* <h2 className="mb-4 text-xl font-semibold text-gray-800">Login</h2> */}
                  {minikitAvailable ? (
                    <Login />
                  ) : (
                    <div className="text-center">
                      <p className="text-red-500 mb-4">Worldcoin MiniKit is not available</p>
                      <a
                        href="https://worldcoin.org/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download MiniKit
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
            <ClaimCoin userAddress={user.walletAddress} />
          </div>
        )}
      </div>
    </div>
  );
}
