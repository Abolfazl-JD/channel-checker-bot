import { BotContext } from ".";
import * as db from "../database";

export const middleware = async (
  ctx: BotContext,
  next: () => Promise<void>,
) => {
  if (ctx.from) {
    ctx.user = await db.getUserByTelegramId(ctx.from.id);

    // Create user if doesn't exist
    if (!ctx.user) {
      await db.saveUser({
        telegram_id: ctx.from.id,
        username: ctx.from.username,
        name: `${ctx.from.first_name} ${ctx.from.last_name || ""}`.trim(),
      });

      ctx.user = await db.getUserByTelegramId(ctx.from.id);
    }
  }

  await next();
};
