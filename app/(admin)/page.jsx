import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 m-10 rounded-md w-full text-white bg-gradient-to-br from-[#0D3B66] via-[#133E7C] to-[#1A4A91]">
      <div className="text-center space-y-5">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-[#64B5F5]">AidlyBot</span>
        </h1>
        <h2 className="text-xl font-light">
          Your customizable AI chat agent that helps manage your customer
          conversations.
        </h2>
        <Link href="/create-chatbot">
          <Button className="bg-[#64B5F5] hover:bg-[#4D9FEF] text-white px-6 py-3 rounded-lg shadow-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}