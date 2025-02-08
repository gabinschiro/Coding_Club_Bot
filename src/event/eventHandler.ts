import { readdirSync } from "fs";
import { ExtendedClient } from "../interface/extendedClient";

function getEvents(): string[] {
  const events: string[] = readdirSync("./src/event/events");
  return events;
}

function handleEvent(event: string, client: ExtendedClient): void {
  const eventHandler: any = require(`./events/${event}`);
  eventHandler(client);
}

export function handleEvents(client: ExtendedClient): void {
  const events: string[] = getEvents();
  events.forEach((event: string) => {
    handleEvent(event, client);
  });
}
