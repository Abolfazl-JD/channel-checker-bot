import { consts } from "../../utils/consts";
import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";
import { Readable } from "stream";

export async function statsHandler(ctx: BotContext) {
  if (!ctx.chat) return;
  if (ctx.chat.type !== "private") return; // Only private chats

  const lang = consts.lang;

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  const csvData = await db.getUsersCsv();

  // Convert string to readable stream
  const stream = Readable.from([csvData]);

  await ctx.replyWithDocument({
    source: stream,
    filename: `stats ${new Date().toLocaleString()}- .csv`,
  });
}
