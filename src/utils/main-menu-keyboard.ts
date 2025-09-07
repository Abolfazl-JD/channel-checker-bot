import { Markup } from "telegraf";
import { i18n } from "../locale";

export function mainMenuKeyboard(lang: string) {
  return Markup.keyboard([
    [Markup.button.text(i18n(lang, "freeChannelJoin"))],
    [
      Markup.button.text(i18n(lang, "changeLanguage")),
      Markup.button.text(i18n(lang, "uidTutorial")),
    ],
    [
      Markup.button.text(i18n(lang, "vipInfo")),
      Markup.button.text(i18n(lang, "support")),
    ],
  ])
    .resize()
    .oneTime();
}
