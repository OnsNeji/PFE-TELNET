import { Message } from "./Messages.model";
import { UserConversation } from "./userConversation.model";

export class Conversation {
    id: number = 0;
    nom!: string;
    messages: Message[] = [];
    userConversations: UserConversation[] = [];
}