// lib/eventStore.ts
import type { FlowCanaryEvent } from "./events";

let _events: FlowCanaryEvent[] = [];

const MAX_EVENTS = 200; // keep it small for now

export function addEvent(event: FlowCanaryEvent) {
  // prepend newest
  _events.unshift(event);
  if (_events.length > MAX_EVENTS) {
    _events = _events.slice(0, MAX_EVENTS);
  }
}

export function getRecentEvents(limit = 50): FlowCanaryEvent[] {
  return _events.slice(0, limit);
}
