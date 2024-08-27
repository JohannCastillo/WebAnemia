import { fetcher } from "@/lib/fetch/fetcher";
import { Message } from "@/types/Chat";
import { ConversationDetails } from "@/types/Chat/conversation-details";
import { ChatMessageDTO } from "@/types/Chat/dto/ChatMessageDTO";

export async function sendMessage(
  selectedChatID: number,
  message: ChatMessageDTO
): Promise<Message | null> {
  try {
    const response = await fetcher(
      `/chatbot/conversations/${selectedChatID}/chat/`,
      {
        method: "POST",
        body: JSON.stringify(message),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      return data;
    }
    console.log("error", response);
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function createDietaConversation(
  dietaID: number
): Promise<{ conversation_id: number } | null> {
  try {
    const response = await fetcher(
      `/chatbot/conversations/create/dieta/${dietaID}`,
      { method: "POST" }
    );
    if (response.ok) {
      return response.json();
    }
    console.error("error", response);
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function createDiagnosticConversation(diagnosticID: number) {
  try {
    const response = await fetcher(
      `/chatbot/conversations/create/diagnostico/${diagnosticID}`,
      { method: "POST" }
    );
    if (response.ok) {
      return response.json();
    }
    console.error("error", response);
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getConversationDeetailsByID(
  conversationID: number
): Promise<ConversationDetails | null> {
  try {
    const response = await fetcher(`/chatbot/conversations/${conversationID}`);
    if (response.ok) {
      return response.json();
    }
    console.error("error", response);
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
