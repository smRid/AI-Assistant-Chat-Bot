export const dynamic = "force-dynamic";
import Messages from "@/components/Messages";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatSessionMessagesResponse
} from "@/types/types";
import React from "react";

async function ReviewSession({ params: { id } }: { params: { id: string } }) {
  const {
    data: {
      chat_sessions: {
        created_at,
        messages,
        chatbots: { name },
        guests: { name: guestName, email },
      },
    },
  } = await serverClient.query<GetChatSessionMessagesResponse>({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: { id: parseInt(id as string) },
  });
  console.log(messages);
  return (
    <div className="flex-1 p-10 pb-24">
      <h1 className=" text-xl lg:text-3xl font-semibold">Session Review</h1>
      <p className="font=light text-xs text-gray-400 mt-2">
        Started at {new Date(created_at).toLocaleString()}
      </p>
      <h2 className="font-light mt-2">
        Between {name} &{" "}
        <span className="font-extrabold">
          {guestName} ({email})
        </span>
      </h2>
      <hr className="my-10" />
      <Messages messages={messages} chatbotName={name} />
    </div>
  );
}

export default ReviewSession;