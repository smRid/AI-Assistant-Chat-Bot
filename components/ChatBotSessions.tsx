"use client";
import { Chatbot } from "@/types/types";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Avatar from "./Avatar";
import ReactTimeAgo from "react-timeago";
import Link from "next/link";

function ChatBotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);
  useEffect(() => {
    const sortedChatbotsByUser: Chatbot[] = [...chatbots]?.sort(
      (a, b) => b.chat_sessions?.length - a.chat_sessions?.length
    );
    setSortedChatbots(sortedChatbotsByUser);
  }, [chatbots]);
  return (
    <div className="bg-white">
      <Accordion type="single" collapsible>
        {sortedChatbots.map((chatbot) => {
          const hasSession = chatbot.chat_sessions.length === 0;
          return (
            <AccordionItem
              className="px-10 py-5"
              key={chatbot.id}
              value={`item-${chatbot.id}`}
            >
              {!hasSession ? (
                <>
                  <AccordionTrigger>
                    <div className=" flex text-left items-center w-full">
                      <Avatar seed={chatbot.name} className="4-10 w-10 mr-4" />
                      <div className="flex flex-1 justify-between space-x-4">
                        <p>{chatbot.name}</p>
                        <p className="pr-4 font-bold text-right">
                          {chatbot.chat_sessions.length}
                          {" Session"}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                    {chatbot.chat_sessions.map((session) => (
                      <Link
                        className="relative p-10 bg-[#2991EE] text-white rounded-md block"
                        key={session.id}
                        href={`/review-sessions/${session.id}`}
                      >
                        <p className="text-white text-lg font-bold">
                          {session.guests?.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-white  font-light">
                          {session.guests?.email || "No email provided"}
                        </p>
                        <p className="absolute text-white  top-5 right-5 text-sm">
                          <ReactTimeAgo
                            locale="en-US"
                            date={new Date(session.created_at)}
                          />
                        </p>
                      </Link>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <p>{chatbot.name} (No session)</p>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default ChatBotSessions;