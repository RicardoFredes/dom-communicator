import type {
  DOMCommunicatorCallback,
  DOMCommunicatorData,
  DOMCommunicatorEvent,
  DOMCommunicatorSubscribers,
} from "./dom-communicator.d";

const getKeyName = (key?: string) => {
  const k = key || "__COMMUNICATOR__";
  if (!key) console.warn(`[Communicator]: Empty key is replaced to "${k}"`);
  return k;
};

export class DOMCommunicator {
  private subscribers: DOMCommunicatorSubscribers = {};
  key = "__COMMUNICATOR__";

  static getInstance(key?: string): DOMCommunicator {
    const k = getKeyName(key);
    // @ts-ignore
    if (typeof window[k] === "undefined") window[k] = new DOMCommunicator();
    // @ts-ignore
    window[k].key = k;
    // @ts-ignore
    return window[k] as Communicator;
  }

  static delInstance(key?: string) {
    const k = getKeyName(key);
    // @ts-ignore
    if (typeof window[k] !== "undefined") delete window[k];
  }

  destroy() {
    const k = this.key;
    // @ts-ignore
    if (typeof window[k] !== "undefined") delete window[k];
  }

  subscribe(event: DOMCommunicatorEvent, fn: DOMCommunicatorCallback) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) this.subscribers[event] = [];
    this.subscribers[event].push(fn);
    return () => this.unsubscribe(event, fn);
  }

  unsubscribe(event: DOMCommunicatorEvent, fn: DOMCommunicatorCallback) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) return false;
    this.subscribers[event] = subs.filter((s) => s !== fn);
    return true;
  }

  publish(event: DOMCommunicatorEvent, data?: DOMCommunicatorData) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) return false;
    subs.forEach((fn) => fn(data));
    return true;
  }
}
