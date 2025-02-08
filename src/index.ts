import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import { handleEvents } from "./event/event_handler";
import { ExtendedClient } from "./interface/extended_client";

const client: Client = new Client({ intents: 32767 });
const extendedClient: ExtendedClient = client as ExtendedClient;

extendedClient.commands = new Collection();

config();
client.login(process.env.TOKEN);
handleEvents(client);