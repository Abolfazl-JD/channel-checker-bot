import * as db from "./database";
import { Telegraf } from "telegraf";
import { kickUserFromChannel } from "./bot/helpers/kickUserFromChannel";
import { getTeamList, TGetTeamListRes } from "./services/getTeamList";
import { isLbankReqSuccessfull } from "./bot/helpers/isLbankReqSuccessfull";

// Sync balances from API
export async function syncBalances(bot: Telegraf<any>) {
  try {
    console.log(new Date().toString(), "Starting balance sync...");

    let start = 0;
    let totalFetched = 0;

    while (true) {
      let res;
      try {
        res = await getTeamList(start);
      } catch (err) {
        console.error(
          new Date().toString(),
          `getTeamList API error at start=${start}:`,
          err,
        );
        console.log(new Date().toString(), "Retrying same page in 5s...");
        await new Promise((r) => setTimeout(r, 5000));
        continue; // retry same page
      }

      // Handle API response
      if (!res || !isLbankReqSuccessfull<TGetTeamListRes[]>(res)) {
        if (res?.error_code === 10004) {
          // Rate limit
          await new Promise((r) => setTimeout(r, 10000));
          continue; // retry same page
        } else {
          console.warn(
            new Date().toString(),
            `API result not successful for start=${start}:`,
            res,
          );
          break;
        }
      }

      const data = res.data || [];
      totalFetched += data.length;

      // Update balances for all users
      for (const balance of data) {
        try {
          await db.updateUserBalances(
            balance.openId,
            Number(balance.currencyTotalFeeAmt),
            Number(balance.contractTotalFeeAmt),
          );
        } catch (error) {
          console.error(
            new Date().toString(),
            `Error updating balance for UID ${balance.openId}:`,
            error,
          );
        }
      }

      if (data.length < 100) {
        break;
      }

      start += 100;
    }

    // Check if any joined users are below threshold
    const users = await db.getJoinedUsers();
    const threshold = await db.getThreshold();
    console.log(
      new Date().toString(),
      `Checking ${users.length} joined users against threshold ${threshold}`,
    );

    for (const user of users) {
      try {
        const updatedUser = await db.getUserByTelegramId(user.telegram_id);
        if (updatedUser && db.getTotalBalance(updatedUser) < threshold) {
          console.log(
            new Date().toString(),
            `User ${user.telegram_id} below threshold, kicking...`,
          );

          const kicked = await kickUserFromChannel(bot, user.telegram_id);

          if (kicked) {
            await db.markUserLeft(user.telegram_id);
            try {
              const lang = user.lang || "en";
              await bot.telegram.sendMessage(
                user.telegram_id,
                lang === "fa"
                  ? "به دلیل کمتر بودن موجودی شما از حد آستانه، از کانال حذف شده اید."
                  : "You have been removed from the channel because your balance fell below the threshold.",
              );
            } catch (notifyError) {
              console.error(
                new Date().toString(),
                `Could not notify user ${user.telegram_id}:`,
                notifyError,
              );
            }
          }
        }
      } catch (userError) {
        console.error(
          new Date().toString(),
          `Error checking user ${user.telegram_id}:`,
          userError,
        );
      }
    }

    console.log(
      new Date().toString(),
      `Balance sync completed. Total users updated from API: ${totalFetched}`,
    );
  } catch (error) {
    console.error(new Date().toString(), "Error syncing balances:", error);
  }
}

// Setup periodic balance syncing
export function setupBalanceSync(bot: Telegraf<any>) {
  const interval =
    parseInt(process.env.SYNC_INTERVAL_MINUTES || "30", 10) * 60 * 1000;

  setInterval(() => {
    syncBalances(bot).catch((err) =>
      console.error(
        new Date().toString(),
        "Error in scheduled balance sync:",
        err,
      ),
    );
  }, interval);

  // Run initial sync
  syncBalances(bot).catch((err) =>
    console.error(new Date().toString(), "Error in initial balance sync:", err),
  );

  console.log(
    new Date().toString(),
    `Balance sync scheduled every ${interval / 60000} minutes`,
  );
}
