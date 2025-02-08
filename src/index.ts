import { Client } from "discord.js";
import { config } from "dotenv";
import { handleEvents } from "./event/event_handler";

const client = new Client({ intents: 32767 });

config();
client.login(process.env.TOKEN);
handleEvents(client);