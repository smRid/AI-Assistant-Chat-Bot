import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";
import React from "react";

function LoginPage() {
  return (
    <div
      className="flex py-10 md:py-0 flex-col flex-1 justify-center items-center"
      style={{
        background:
          "linear-gradient(135deg, #0D3B66 0%, #133E7C 50%, #1A4A91 100%)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="rounded-full bg-white p-5">
            <Avatar className="h-60 w-60" seed={"Assistly"} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl">AidlyBot</h1>
            <h2 className="text-base font-light">
              Your Customizable AI Chat Agent
            </h2>
            <h3 className="text-base font-light">Sign in to get started</h3>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}

export default LoginPage;