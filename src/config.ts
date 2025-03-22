import 'dotenv/config';


const { DISCORD_WEBHOOK_URL, PORT } = process.env;

if (!DISCORD_WEBHOOK_URL) {
  throw new Error("Missing environment variables");
}

export const env = {
  DISCORD_WEBHOOK_URL: DISCORD_WEBHOOK_URL ?? "",
  PORT: PORT ?? 3000,
};