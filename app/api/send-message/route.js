import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse, MessageBYChatSessionIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is defined
const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in the environment variables.");
}
const genAI = new GoogleGenerativeAI(googleApiKey);

async function sendMessageWithRetry(chat: { sendMessage: (content: string) => Promise<{ response: { text: () => string } }> }, content: string, retries = 5, delay = 2000): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await chat.sendMessage(content);
            const aiResponse = result?.response?.text?.();
            if (aiResponse) {
                console.log(aiResponse);
                return aiResponse; // Success!
            } else {
                console.error("Received empty response from AI, retrying...");
            }
        } catch (error: { status?: number; message?: string }) {
            if (error.status === 503 && i < retries - 1) {
                console.warn(`Model overloaded. Retrying in ${delay / 1000} seconds... (Attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                console.error(`Error sending message: ${error.message}`);
                throw error; // Re-throw if it's not a 503 or max retries reached
            }
        }
    }
    throw new Error("Failed to send message after multiple retries due to model overload.");
}

export async function POST(req: NextRequest) {
    const { chat_session_id, chatbot_id, content, name, created_at } = await req.json();
    console.log(`Received message from chat session ${chat_session_id}:${content} (chatbot:${chatbot_id})`);

    try {
        const { data } = await serverClient.query<GetChatbotByIdResponse>({
            query: GET_CHATBOT_BY_ID,
            variables: { id: chatbot_id },
        });

        const chatbot = data.chatbots;

        if (!chatbot) {
            return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
        }

        const { data: messagesData } = await serverClient.query<MessageBYChatSessionIdResponse>({
            query: GET_MESSAGES_BY_CHAT_SESSION_ID,
            variables: { chat_session_id },
            fetchPolicy: "no-cache",
        });

        const previousMessages = messagesData.chat_sessions.messages;

        const formattedPreviousMessages = previousMessages.map((message) => ({
            role: message.sender === "ai" ? "model" : "user",
            parts: [{ text: message.content }],
        }));

        const systemPrompt = chatbot.chatbot_characteristics.map((c) => c.content).join(" + ");
        console.log(systemPrompt);

        // Manually define available models as listModels is not supported
        const availableModels = [
            { name: "gemini-2.0-flash", supportedGenerationMethods: ["generateContent"] },
            { name: "gemini-1.5-flash", supportedGenerationMethods: ["generateContent"] } // Example fallback model
        ];

        // Filter for models that support 'generateContent'
        const validModels = availableModels.filter((model: { name: string; supportedGenerationMethods: string[] }) => model.supportedGenerationMethods.includes("generateContent"));
        if (validModels.length === 0) {
            throw new Error("No models supporting 'generateContent' are available.");
        }

        const selectedModel = validModels[0]; // Use the first valid model
        console.log("Using model:", selectedModel.name);
        const model = genAI.getGenerativeModel({ model: selectedModel.name });

        // Start a chat session
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content. Use Emojis where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I'm ready to assist within the specified parameters." }],
                },
                ...formattedPreviousMessages
            ],
        });

        // Send the message and get the response
        const aiResponse = await sendMessageWithRetry(chat, content);
        console.log("AI Response:", aiResponse);
        if (!aiResponse) {
            return NextResponse.json("Failed to generate AI response", { status: 500 });
        }

        await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: { chat_session_id, content, sender: "user", created_at: created_at }
        });

        // Use a new timestamp for the AI message
        const aiCreatedAt = new Date().toISOString();
        const aiMessageResult = await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: { chat_session_id, content: aiResponse, sender: "ai", created_at: aiCreatedAt }
        });
        return NextResponse.json({
            id: aiMessageResult.data.insertMessages.id,
            content: aiResponse
        });

    } catch (error) {
        console.error("Error sending message:", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}