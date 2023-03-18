import { MessageParameter } from 'app/models/shared';

export class Message {
    from: string;
    to: string;
    cc: string;
    subject: string;
    body: string;
    messageParameters: Array<MessageParameter>;
}
