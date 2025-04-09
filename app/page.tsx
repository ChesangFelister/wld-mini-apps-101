"use client";
import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { Login } from "@/components/Login";
import Image from "next/image";
import { ClaimCoin } from "@/components/ClaimCoin";

// Updated User interface to match the one in Login component
interface User {
  walletAddress: string;
  username: string | null; // Changed from string | undefined to string | null
  profilePictureUrl?: string | null;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const checkMiniKit = async () => {
      const isInstalled = MiniKit.isInstalled();
      if (isInstalled) {
        setIsLoading(false);
        // Check if user is already logged in
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setUser(data.user);
              setIsLoggedIn(true);
            }
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
        }
      } else {
        setTimeout(checkMiniKit, 500);
      }
    };
    checkMiniKit();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setLoginError("");
  };

  const handleLoginError = (error: string) => {
    setLoginError(error);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-16 h-16">
            <svg
              className="animate-spin h-16 w-16 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="mt-6 text-lg font-medium text-indigo-900">
            Loading MiniKit...
          </p>
          <p className="mt-2 text-sm text-indigo-600">
            Please wait while we initialize the application
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="w-full max-w-md mx-auto space-y-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full shadow-lg mb-4">
            <Image
              src="https://assets.onecompiler.app/42p32vw56/43bcqbgx8/1000012334.png"
              className="h-10 w-10 text-white"
              alt=""
              width={40}
              height={40}
            />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Astracoin
          </h1>
          <p className="mt-2 text-gray-600">
            The future of decentralized currency
          </p>
        </div>
        {isLoggedIn && user ? (
          <>
            <section className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Claim Astracoin
                </h2>
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
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connected as:{" "}
                  <span className="font-mono ml-1 font-medium">
                    {user.username ||
                      user.walletAddress.substring(0, 6) +
                        "..." +
                        user.walletAddress.substring(
                          user.walletAddress.length - 4
                        )}
                  </span>
                </p>
              </div>
              <div>
                <ClaimCoin userAddress={user.walletAddress} />
              </div>
            </section>
            <section className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Your Balance
              </h2>
              <div className="flex justify-center items-center p-6 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Available Astracoin
                  </p>
                  <p className="text-4xl font-bold text-indigo-700">
                    1,000 Atc
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              Connect Your Account
            </h2>
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">
              Astra
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Connect with World ID to access your Astracoin wallet and start
              claiming your coins.
            </p>
            {loginError && (
              <div className="mb-4 text-red-500 text-center">{loginError}</div>
            )}
            <div className="bg-white p-4 rounded-lg">
              {/* Fixed the Login component syntax */}
              <Login
                onLoginSuccess={handleLoginSuccess}
                onLoginError={handleLoginError}
              />
            </div>
            {/* <p className="mt-4 text-sm text-gray-500 text-center">
              New to Astracoin? Create an account
            </p> */}
          </section>
        )}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Astracoin. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
