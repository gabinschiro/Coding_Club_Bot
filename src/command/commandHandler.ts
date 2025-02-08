import { readdirSync } from "fs";
import { ExtendedClient } from "../interface/extendedClient";

export async function handleCommands(client: ExtendedClient): Promise<void> {
  const commands: string[] = readdirSync("./src/command/commands");
  const commandArray: any[] = [];

  commands.forEach((command) => {
    const commandFile = require(`./commands/${command}`);
    client.commands.set(commandFile.data.name, commandFile);
    commandArray.push(commandFile.data.toJSON());
  });
  client.commandArray = commandArray;
}
