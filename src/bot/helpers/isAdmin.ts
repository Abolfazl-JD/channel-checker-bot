import { BotContext } from "..";

export const isAdmin = (ctx: BotContext): boolean => {
  if (!ctx.from) return false;

  // Check if admin IDs from env contains this user
  const adminIds = process.env.ADMIN_IDS
    ? JSON.parse(process.env.ADMIN_IDS)
    : [];

  if (adminIds.includes(ctx.from.id)) return true;

  // Check if user is admin in database
  return ctx.user?.is_admin === 1;
};
