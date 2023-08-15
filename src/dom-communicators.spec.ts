import { DOMCommunicator } from "./dom-communicator";

Object.defineProperty(global, "window", {
  value: {},
  writable: true,
  configurable: true,
});

Object.defineProperty(global, "console", {
  value: {
    warn: jest.fn(),
  },
});

describe("DOMCommunicators", () => {
  describe("when key is customized", () => {
    it("should instance with default key", () => {
      const DEFAULT_KEY = "__COMMUNICATOR__";
      const communicator = DOMCommunicator.getInstance();
      // @ts-ignore
      expect(global.window[DEFAULT_KEY]).toEqual(communicator);

      communicator.destroy();
      // @ts-ignore
      expect(global.window[DEFAULT_KEY]).toBeUndefined();
    });

    it("should instance with personal key", () => {
      const PERSONAL_KEY = "__PERSONAL_KEY__";
      const communicator = DOMCommunicator.getInstance(PERSONAL_KEY);
      // @ts-ignore
      expect(global.window[PERSONAL_KEY]).toEqual(communicator);

      communicator.destroy();
      // @ts-ignore
      expect(global.window[PERSONAL_KEY]).toBeUndefined();
    });
  });

  describe("when publish event", () => {
    const EVENT = "any_event";
    const DATA = "any_data";

    const mockedCallbacks = [jest.fn(), jest.fn(), jest.fn()];

    beforeEach(jest.clearAllMocks);

    it("should subscribe, publish and unsubscribe event", () => {
      const communicator = DOMCommunicator.getInstance();

      const [mockedCallback] = mockedCallbacks;

      communicator.subscribe(EVENT, mockedCallback);

      communicator.publish(EVENT, DATA);

      expect(mockedCallback).toBeCalledWith(DATA);
      mockedCallback.mockClear();

      communicator.unsubscribe(EVENT, mockedCallback);
      communicator.publish(EVENT, DATA);

      expect(mockedCallback).not.toBeCalled();

      communicator.destroy();
    });

    it("should communicate all subscribes", () => {
      const communicator = DOMCommunicator.getInstance();

      mockedCallbacks.forEach((cb) => communicator.subscribe(EVENT, cb));
      communicator.publish(EVENT, DATA);

      mockedCallbacks.forEach((cb) => {
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(DATA);
      });

      communicator.destroy();
    });

    it("should unsubscribe one callback event between all subscribes", () => {
      const communicator = DOMCommunicator.getInstance();

      mockedCallbacks.forEach((cb) => communicator.subscribe(EVENT, cb));

      communicator.unsubscribe(EVENT, mockedCallbacks[0]);

      communicator.publish(EVENT);

      expect(mockedCallbacks[0]).not.toBeCalled();
      expect(mockedCallbacks[1]).toBeCalled();
      expect(mockedCallbacks[2]).toBeCalled();

      communicator.destroy();
    });

    it("should publish more events", () => {
      const communicator = DOMCommunicator.getInstance();

      const EVENT_ONE = "EVENT_ONE";
      mockedCallbacks.forEach((cb) => communicator.subscribe(EVENT_ONE, cb));

      const EVENT_TWO = "EVENT_TWO";
      communicator.subscribe(EVENT_TWO, mockedCallbacks[1]);

      communicator.publish(EVENT_ONE);
      expect(mockedCallbacks[0]).toBeCalled();
      expect(mockedCallbacks[1]).toBeCalled();
      expect(mockedCallbacks[2]).toBeCalled();

      mockedCallbacks.forEach((cb) => cb.mockClear());

      communicator.publish(EVENT_TWO);
      expect(mockedCallbacks[0]).not.toBeCalled();
      expect(mockedCallbacks[1]).toBeCalled();
      expect(mockedCallbacks[2]).not.toBeCalled();

      communicator.destroy();
    });
  });
});
