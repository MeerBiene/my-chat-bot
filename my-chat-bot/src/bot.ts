// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';
const PREFIX = "!"

export class EchoBot extends ActivityHandler {
    messagehandler: (context: any, message: any) => Promise<void>;
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const message = context.activity.text;
            const replyText = `Echo: ${ context.activity.text }`;
            // By calling next() you ensure that the next BotHandler is run.
            message.startsWith(PREFIX) ? await this.messagehandler(context, message) : 
                await next();
            await next();
        });

        this.messagehandler = async (context, message) => {
            console.log("Received message to handle")
            const cmds = {
                "test": {
                    run: async (context, message) => {
                        await context.sendActivity(MessageFactory.text("This is a reply method dont mind me."));
                    }
                }
            }
            const a = message.replace(PREFIX, "");
            cmds.hasOwnProperty(a) ? await cmds[a].run(context, a) : console.log("nothing");
        } 

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
