import { Dieta } from "../Dieta";
import { ConversationType } from "./types";

export interface ConversationDetails {
    conversation : {
        id: number;
        created_at: string;
        updated_at: string;
        type : ConversationType
        user: number
    }
}

export interface DietaConversationDetails extends ConversationDetails{
    dieta : Dieta
    type : ConversationType.DIETA
}