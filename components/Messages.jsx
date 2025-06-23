"use client";
import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName?: string;
}) {
  const path = usePathname();
  const isReviewsPage = path.includes("review-sessions");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log(messages);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg">
      {messages.map((message, index) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id || index} // Use index as a fallback key if message.id is undefined
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            <div
              className={`flex items-center gap-2 ${
                isSender ? "justify-start" : "justify-end"
              }`}
            >
              {isSender ? (
                <div
                  className={`chat-image avatar w-10 h-10 rounded-full border-2 border-[#2991EE] flex items-center justify-center`}
                >
                  <Avatar
                    seed={chatbotName || "default"}
                    className="h-10 w-10 bg-white rounded-full border-2 border-[#2991EE]"
                  />
                </div>
              ) : (
                <div
                  className={`chat-image avatar w-10 h-10 rounded-full border-2 border-[#2991EE] flex items-center justify-center order-last`}
                >
                  <UserCircle className="text-[#2991EE] h-6 w-6" />
                </div>
              )}
              <div
                className={`chat-bubble p-4 rounded-lg shadow-md ${
                  isSender
                    ? "bg-[#4D7DFB] text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: (props) => (
                      <ul
                        {...props}
                        className="list-disc list-inside ml-5 mb-5"
                      />
                    ),
                    ol: (props) => (
                      <ol
                        {...props}
                        className="list-decimal list-inside ml-5 mb-5"
                      />
                    ),
                    h1: (props) => (
                      <h1 {...props} className="text-2xl font-bold mb-5" />
                    ),
                    h2: (props) => (
                      <h2 {...props} className="text-xl font-bold mb-5" />
                    ),
                    h3: (props) => (
                      <h3 {...props} className="text-lg font-bold mb-5" />
                    ),
                    table: (props) => (
                      <table
                        {...props}
                        className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5"
                      />
                    ),
                    th: (props) => (
                      <th {...props} className="text-left underline" />
                    ),
                    p: (props) => (
                      <span
                        {...props}
                        className={`break-words whitespace-break-spaces mb-5 ${
                          message.content === "Thinking..." && "animate-pulse"
                        }${isSender ? "text-white" : "text-gray-800"}`}
                      >
                        {props.children}
                      </span>
                    ),
                    a: (props) => (
                      <a
                        {...props}
                        target="_blank"
                        className="font-bold underline hover:text-blue-400"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {typeof message.content === "string" && message.content.trim() !== ""
                    ? message.content
                    : "[No content provided]"}
                </ReactMarkdown>
              </div>
            </div>
            {isReviewsPage && (
              <p
                className={`text-xs text-gray-400 mt-2 ${
                  isSender ? "text-left" : "text-right"
                }`}
              >
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}
          </div>
        );
      })}
      <div ref={ref} />
    </div>
  );
}

export default Messages;