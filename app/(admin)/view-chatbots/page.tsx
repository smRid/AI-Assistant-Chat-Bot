import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { Chatbot, GetChatbotsByUserData, GetChatbotsByUserDataVariables } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";


export const dynamic = "force-dynamic";
async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const response = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_CHATBOTS_BY_USER
  });
  console.log('serverClient.query response:', response);

  // Filter chatbots by clerk_user_id
  const chatbotsByUser = (response?.data?.chatbotsList || []).filter(
  (chatbot: Chatbot) => chatbot.clerk_user_id === userId
);

  const sortedChatbotsByUser: Chatbot[] = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  console.log('sortedChatbotsByUser:', sortedChatbotsByUser);
  
   return (
    <div className="flex-1 pb-20 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">
        Active Chatbots
      </h1>

      {sortedChatbotsByUser.length === 0 && (
        <div>
          <p>
            You have not created chatbots yet, click the button below to create
          </p>
          <Link href={"/create-chatbot"}>
            <Button className="bg-[#64B5F5] text-white p-3 rounded-md">
              Create Chatbots
            </Button>
          </Link>
        </div>
      )}

      <ul className="flex flex-col space-y-5">
        {sortedChatbotsByUser.map((chatbot) => (
          <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar seed={chatbot.name} />
                  <h2 className="text-xl font-bold">{chatbot.name}</h2>
                </div>
                <span className="text-xs text-gray-400">
                  Created: {new Date(chatbot.created_at).toLocaleString()}
                </span>
              </div>
              <hr className="mb-4" />
              <div className="flex flex-col md:flex-row md:items-start md:space-x-10">
                <div className="md:w-1/2">
                  <h3 className="italic mb-2">Characteristics:</h3>
                  <ul className="text-xs list-disc list-inside">
                    {chatbot.chatbot_characteristics.length === 0 ? (
                      <li className="text-gray-400">No characteristics added yet.</li>
                    ) : null}
                    {chatbot.chatbot_characteristics.length > 0 &&
                      chatbot.chatbot_characteristics.map((characteristic) => (
                        <li key={characteristic.id} className="break-words">
                          {characteristic.content}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                  <h3 className="italic mb-2">No of Sessions:</h3>
                  <p>{chatbot.chat_sessions?.length}</p>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbots;