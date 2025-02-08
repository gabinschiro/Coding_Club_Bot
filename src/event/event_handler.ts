import { readdirSync } from "fs";
import { Client } from "discord.js";

export function getEvents() {
  const events = readdirSync("./src/event/events");
  return events;
}

export function handleEvent(event: string, client: Client) {
  const eventHandler = require(`./events/${event}`);
  eventHandler(client);
}

export function handleEvents(client: Client) {
  const events = getEvents();
  events.forEach((event) => {
    handleEvent(event, client);
  });
}
