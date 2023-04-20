import { Conversation } from "./Conversation.model";
import { Utilisateur } from "./utilisateur.model";

export class UserConversation {
    utilisateurId!: number;
    utilisateur: Utilisateur[] = [];
    conversationId!: number;
    conversation: Conversation[] = [];
}