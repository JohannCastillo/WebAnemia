"use client";
import ChatProvider from "@/components/ui/chat/chat.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

interface Props{
    children: React.ReactNode;
}
function Provider({ children }: Props) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </SessionProvider>
      </QueryClientProvider>  
    );
}
export default Provider;