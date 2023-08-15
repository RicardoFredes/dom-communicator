type DOMCommunicatorData =
  | string
  | boolean
  | number
  | null
  | undefined
  | Record<string, any>;
type DOMCommunicatorEvent = string;
type DOMCommunicatorCallback = (data?: DOMCommunicatorData) => any;
type DOMCommunicatorSubscribers = Record<
  DOMCommunicatorEvent,
  DOMCommunicatorCallback[]
>;

class DOMCommunicator {
  private subscribers: DOMCommunicatorSubscribers = {};

  static getInstance(key?: string): DOMCommunicator {
    const k = key || "__COMMUNICATOR__";
    if (!key) console.warn(`[Communicator]: Empty key is replaced to "${k}"`);
    // @ts-ignore
    if (typeof window[k] === "undefined") window[k] = new Communicator();
    // @ts-ignore
    return window[k] as Communicator;
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

export default DOMCommunicator;
export type { DOMCommunicatorData as CommunicatorData, DOMCommunicatorCallback as CommunicatorCallback };
