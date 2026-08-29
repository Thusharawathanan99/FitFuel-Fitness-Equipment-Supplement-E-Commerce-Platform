/**
 * Mock transport. Every service call goes through here, so swapping the mock layer for a
 * real REST client later is a change in this one file rather than in every component.
 */
const LATENCY = 220;

export const ok = (data, ms = LATENCY) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const fail = (message, ms = LATENCY) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
