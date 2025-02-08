import { Client } from "discord.js";
import { readdirSync } from "fs";

function getEvents(): string[] {
  const events: string[] = readdirSync("./src/event/events");
  return events;
}

function handleEvent(event: string, client: Client): void {
  const eventHandler: any = require(`./events/${event}`);
  eventHandler(client);
}

export function handleEvents(client: Client): void {
  const events: string[] = getEvents();
  events.forEach((event: string) => {
    handleEvent(event, client);
  });
}
