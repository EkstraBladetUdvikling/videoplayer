export default class EmitterClass {
	private listeners: { [event: string]: ((data?: { [key: string]: any }) => void)[] } = {};

	public emit(event: string, data?: { [key: string]: any }) {
		this.listeners[event]?.forEach((cb) => cb(data));
	}

	public on(event: string, callback: (data?: { [key: string]: any }) => void) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}
}
