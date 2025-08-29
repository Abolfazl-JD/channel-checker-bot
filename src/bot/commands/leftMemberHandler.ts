import { BotContext } from "..";

export async function leftMemberHandler(ctx: BotContext) {
  if (!ctx.chat || !ctx.message || !("left_chat_member" in ctx.message)) return;
  // Skip if not in the target group
  if (ctx.chat.id.toString() !== process.env.GROUP_ID) return;

  const member = ctx.message.left_chat_member;
  console.log(new Date().toString(), `${member.username || member.id} left the chat.`);
}
