export type EmitterReadyEvent = {
	videoElement: HTMLVideoElement;
};
export type EmitterPlayEvent = {
	autoPlay: boolean;
};

export type CallbackData = EmitterReadyEvent | EmitterPlayEvent | undefined;

type EventCallback = (data?: CallbackData) => void;
type AnyEventCallback = (event: string, data?: CallbackData) => void;

export default class EmitterClass {
	private listeners: { [event: string]: EventCallback[] } = {};
	private anyListeners: AnyEventCallback[] = [];

	public emit(event: string, data?: CallbackData) {
		this.listeners[event]?.forEach((cb) => cb(data));
		this.anyListeners.forEach((cb) => cb(event, data));
	}

	public on(event: string, callback: EventCallback) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}

	public onAny(callback: AnyEventCallback) {
		this.anyListeners.push(callback);
	}

	public forwardEventsFrom(source: EmitterClass, excludeEvents: string[] = []) {
		source.onAny((event, data) => {
			if (excludeEvents.includes(event)) return;

			this.emit(event, data);
		});
	}
}
