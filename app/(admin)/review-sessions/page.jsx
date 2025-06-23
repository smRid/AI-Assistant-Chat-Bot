import ChatBotSessions from "@/components/ChatBotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetUserChatbotsResponse,
  GetUserChatbotsVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;
  const response = await serverClient.query<
    GetUserChatbotsResponse,
    GetUserChatbotsVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { userId: userId },
  });
  console.log("serverClient.query response:", response);

  // Filter chatbots to only show those belonging to the current user
  const chatbotsList = (response?.data?.chatbotsList || []).filter(
    (chatbot: Chatbot) => chatbot.clerk_user_id === userId
  );

  const sortChatbotsByUsers: Chatbot[] =
    chatbotsList.map((chatbot: Chatbot) => ({
      ...chatbot,
      chat_sessions: chatbot?.chat_sessions
        ? [...chatbot.chat_sessions].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        : [],
    })) || [];

  return (
    <div className="flex-1 px-10">
      <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
      <h2 className="mb-5">
        Review all the chat session that chat bots have had with your customers
      </h2>
      <ChatBotSessions chatbots={sortChatbotsByUsers} />
    </div>
  );
}

export default ReviewSessions;