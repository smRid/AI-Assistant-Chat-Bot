import client from "@/graphql/apolloClient";
import { INSERT_CHAT_SESSION, INSERT_GUEST, INSERT_MESSAGE } from "@/graphql/mutations/mutations";

async function startNewChat(
    guestName: string,
    guestEmail: string,
    chatbotId: number
) {
    try {

        //Create a new guest and chat session
        const guestResult = await client.mutate({
            mutation: INSERT_GUEST,
            variables: { name: guestName, email: guestEmail, created_at: new Date().toISOString(), },
        });
        const guestId = guestResult.data.insertGuests.id;

        //Initialize a new chat session with the chatbot and guest
        const chatSessionResult = await client.mutate({
            mutation: INSERT_CHAT_SESSION,
            variables: { chatbot_id: chatbotId, guest_id: guestId, created_at: new Date().toISOString(), },
        });
        const chatSessionId = chatSessionResult.data.insertChat_sessions.id;


        //Insert a welcome message from the AI
        await client.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id: chatSessionId,
                sender: "ai",
                content: `Welcome ${guestName}!\n How can I assist you today?😊`,
                created_at: new Date().toISOString(),
            }

        });
        console.log("Now chat session started successfully");
        return chatSessionId;
    } catch (error) {
        console.error("error", error);
    }
}

export default startNewChat;