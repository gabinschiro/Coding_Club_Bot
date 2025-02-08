import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import { handleEvents } from "./event/eventHandler";
import { handleCommands } from "./command/commandHandler";
import { ExtendedClient } from "./interface/extendedClient";

const client: Client = new Client({ intents: 32767 });
const extendedClient: ExtendedClient = client as ExtendedClient;

extendedClient.commands = new Collection();
config();
client.login(process.env.TOKEN);
handleEvents(extendedClient);
handleCommands(extendedClient);