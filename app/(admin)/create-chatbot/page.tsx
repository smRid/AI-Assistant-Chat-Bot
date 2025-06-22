"use client"

import Avatar from "@/components/Avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations"
import { useMutation } from "@apollo/client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

function CreateChatBot() {
   const {user} = useUser()
   const [name, setName] = useState("")
   const router = useRouter()

  const [createChatbot, { data, loading, error }] = useMutation(CREATE_CHATBOT, {
  variables: {
    clerk_user_id: user?.id,
    name,
    created_at: new Date().toISOString(),
  }
});

  const handleSubmit= async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await createChatbot();
      setName("");
      
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`)

    } catch (err) {
      console.error(err)
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white rounded-md m-10 p-10">
      <Avatar seed="create-chatbot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">Create a new chatbot to assist you in your conversations with you customers.</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mt-5">
            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chatbot Name..."
                className="max-w-lg"
                required
            />
            <Button type="submit" disabled={loading || !name} className='bg-black text-white'>
                {loading ? "Creating Chatbot..." : "Create Chatbot"}
            </Button>
        </form>
        <p className='text-gray-300 mt-5'>Example: Customer Support Chatbot</p>

      </div>
    </div>
  ) 
}

export default CreateChatBot
