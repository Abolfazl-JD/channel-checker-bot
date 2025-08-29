import { messages_en, messages_fa } from "./messages";

// export type Ti18n = (lang: string, key: string, ...args: any[]) => string;
export function i18n(
  lang: string,
  key: keyof typeof messages_en,
  ...args: any[]
): string {
  const locale = lang === "fa" ? "fa" : "en";
  let message = locale == "en" ? messages_en[key] : messages_fa[key] || key;

  args.forEach((arg, i) => {
    message = message.replace(`{${i}}`, arg);
  });

  return message;
}
