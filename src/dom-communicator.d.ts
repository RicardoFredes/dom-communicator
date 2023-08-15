export type DOMCommunicatorData =
  | string
  | boolean
  | number
  | null
  | undefined
  | Record<string, any>;
export type DOMCommunicatorEvent = string;
export type DOMCommunicatorCallback = (data?: DOMCommunicatorData) => any;
export type DOMCommunicatorSubscribers = Record<DOMCommunicatorEvent, DOMCommunicatorCallback[]>;
