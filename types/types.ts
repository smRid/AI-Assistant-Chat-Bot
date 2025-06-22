export interface Chatbot {
    id: number;
    clerk_user_id: string;
    name: string;
    created_at: string;
    chatbot_characteristics: ChatbotCharacteristics[],
    chat_sessions: ChatSession[];
}
export interface ChatbotCharacteristics {
    id: number;
    chatbot_id: number;
    content: string;
    created_at: string;
}
export interface Guest {
    id: number;
    name: string;
    email: string;
    created_at: string;
}
export interface ChatSession {
    id: number;
    chatbot_id: number;
    guest_id: number;
    created_at: string;
    messages: Message[];
    guests: Guest;
}
export interface Message {
    id: number;
    chat_session_id: number;
    content: string;
    created_at: string;
    sender: "ai" | "user";
}

export interface GetChatbotByIdResponse {
    chatbots: Chatbot;
}

export interface GetChatbotByIdVariables {
    id: string;
}