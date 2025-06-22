'use client'

import { Input } from "@/components/ui/input"
import { BASE_URL } from "@/graphql/apolloClient";
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types";
import Characteristic from "@/components/Characteristic";
import { ADD_CHARACTERISTIC, DELETE_CHATBOT, UPDATE_CHATBOT } from "@/graphql/mutations/mutations";


// function EditChatbot({ params: { id } }: { params: { id: string } }) {
//   const [url, setUrl] = useState<string>("");

function EditChatbot() {
  const params = useParams();
  const id = params.id as string;
  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");
  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const [updateChatebot] = useMutation(UPDATE_CHATBOT,{
    refetchQueries: ["GetChatbotById"],
  })

  const { data, loading, error} = useQuery<
    GetChatbotByIdResponse, 
    GetChatbotByIdVariables
    >(
      GET_CHATBOT_BY_ID, 
      { variables: {id} },
  )

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);

  const handleAddCharacteristic = async (content: string) => {
    try {
        const promise = addCharacteristic({
          variables: {
            chatbotId: Number(id),
            content,
            created_at: new Date().toISOString(),
          },
        });
        toast.promise(promise, {
          loading: "adding..",
          success: "Information added",
          error: "Failed to add Information",
        });
      } catch (error) {
        console.log("Failed to add Characteristic", error);
      }
    };

  const handleUpdateChatbot = async(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
      const promise = updateChatebot({
        variables:{
          id,
          name:chatbotName
        }
      })
      toast.promise(promise,{
        loading: "Updating...",
        success: "Chatbot name Successfully updated",
        error: "Failed to upadte chatbot",
      })
    } catch (error) {
      console.log("Failed to update chatbot", error);
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;

    try {
      const promise = deleteChatbot({ variables: { id } });
      toast.promise(promise, {
        loading: "Deleting...",
        success: "Chatebot sucessfully deleted",
        error: "Failed to delete chatbot",
      });
    } catch (error) {
      console.error("Error deleting chatbot:", error);
      toast.error("Failed to delete chatbot");
    }
  };

  if (loading)
    return (
      <div className="mx-auto animate-spin p-10">
        <Avatar seed="loading..." />
      </div>
    );
  
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.chatbots) return redirect("/view-chatbots");

  return <div className="px-0 md:p-10">
    <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2997E1]">
      <h2 className="text-white text-sm font-bold">Link to Chat</h2>
      <p className="text-sm italic text-white">
        Share this link with your customers to start a chat with your chatbot.
      </p>
      <div className="flex items-center space-x-2">
        <Link href={url} className="w-full cusor-pointer hover:opacity-50">
          <Input 
            value={url} readOnly className="cursor-pointer bg-white  text-black"
          />
        </Link>
        <Button
          size="sm"
          className="px-3 bg-black text-white cursor-pointer hover:opacity-60"
          onClick={() => {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
          }}
        >
          <span className="sr-only">Copy</span>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
     <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
          <Button variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            onClick={() => handleDelete(id)}
          >X</Button>
          <div className="flex space-x-4">
            <Avatar seed={chatbotName}/>

            <form 
            onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
            
            >
              <Input value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                  placeholder={chatbotName}
                  className="w-full border-b-gray-700 bg-transparent text-xl font-bold"
                  required
              />
              <Button 
              type="submit" 
              disabled={!chatbotName}
              className=" bg-black text-white cursor-pointer hover:opacity-60"
              
              >Update</Button>
            </form>
          </div>

          <h2 className="text-xl font-bold mt-10">Heres what your AI knows...</h2>
          <p className="text-wrap">
          Your chatbot is equipped with following information to assist you is
          your conversations with your customers and users
        </p>

        <div className="bg-gray-200 p-5 mb:p-5 rounded-md mt-5">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddCharacteristic(newCharacteristic);
            setNewCharacteristic("");
          }}
          className="flex space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Example: If customer asks for prices, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type="submit" disabled={!newCharacteristic}
              className="bg-black text-white cursor-pointer"
            >
              Add
            </Button>
          </form>

            <ul className="flex flex-wrap-reverse gap-5">
              {data?.chatbots?.chatbot_characteristics?.map((characteristic) => (
                <Characteristic
                  key={characteristic.id}
                  characteristic={characteristic}
                />
              ))}
            </ul>
        </div>
     </section>
  </div>

}

export default EditChatbot
