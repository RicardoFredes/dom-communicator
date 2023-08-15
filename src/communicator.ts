type CommunicatorData =
  | string
  | boolean
  | number
  | null
  | undefined
  | Record<string, any>;
type CommunicatorEvent = string;
type CommunicatorCallback = (data?: CommunicatorData) => any;
type CommunicatorSubscribers = Record<
  CommunicatorEvent,
  CommunicatorCallback[]
>;

class Communicator {
  private subscribers: CommunicatorSubscribers = {};

  static getInstance(key?: string): Communicator {
    const k = key || "__COMMUNICATOR__";
    if (!key) console.warn(`[Communicator]: Empty key is replaced to "${k}"`);
    // @ts-ignore
    if (typeof window[k] === "undefined") window[k] = new Communicator();
    // @ts-ignore
    return window[k] as Communicator;
  }

  subscribe(event: CommunicatorEvent, fn: CommunicatorCallback) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) this.subscribers[event] = [];
    this.subscribers[event].push(fn);
    return () => this.unsubscribe(event, fn);
  }

  unsubscribe(event: CommunicatorEvent, fn: CommunicatorCallback) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) return false;
    this.subscribers[event] = subs.filter((s) => s !== fn);
    return true;
  }

  publish(event: CommunicatorEvent, data?: CommunicatorData) {
    const subs = this.subscribers[event];
    if (!Array.isArray(subs)) return false;
    subs.forEach((fn) => fn(data));
    return true;
  }
}

export default Communicator;
export type { CommunicatorData, CommunicatorCallback };
