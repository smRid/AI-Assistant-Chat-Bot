import Link from "next/link"
import Avatar from "./Avatar"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

function Header() {
  return (
    <header className="bg-gradient-to-br from-[#101720] to-[#00ADB5] shadow-md text-white flex justify-between p-5"> 
      <Link href="/" className="flex items-center text-4xl font-thin gap-4">
        <Avatar seed='RIDUAN Chat Bot'/>
        <div className="space-y-1">
          <h1 className="text-white">AidlyBot</h1>
          <h2 className="text-sm text-gray-200">Your Customizable AI Chat Agent</h2>
        </div>
      </Link>

      <div className="flex items-center">
        <SignedIn>
            <UserButton showName/>
        </SignedIn>

        <SignedOut>
            <SignInButton/>
        </SignedOut>
      </div>
    </header>
  )
}

export default Header
