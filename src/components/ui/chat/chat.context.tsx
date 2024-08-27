import { fetcher } from "@/lib/fetch/fetcher";
import { ConversationsHistory } from "@/types/Chat";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface IChatContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  getConversationsQuery: UseQueryResult<ConversationsHistory, unknown>;
  selectedChatID: number | null;
  setSelectedChatID: (selectedChatID: number | null) => void;
}

const ChatContext = createContext({} as IChatContextProps);

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedChatID, setSelectedChatID] = useState<number | null>(null);

  const getConversationsQuery = useQuery<ConversationsHistory>({
    queryKey: ["chat"],
    queryFn: async () => {
      const response = await fetcher("/chatbot/conversations");
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        return data;
      }
      console.log("error", response);
      return null;
    },
  });

  return (
    <ChatContext.Provider
      value={{
        open,
        setOpen,
        getConversationsQuery,
        selectedChatID,
        setSelectedChatID,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
