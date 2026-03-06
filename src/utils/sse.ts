/**
 * React Native용 SSE(Server-Sent Events) 클라이언트.
 * XMLHttpRequest의 onprogress를 활용해 스트림 응답을 실시간 파싱한다.
 */

interface SSEOptions {
	headers?: Record<string, string>;
	onMessage: (data: string) => void;
	onError?: () => void;
	onOpen?: () => void;
	reconnectInterval?: number;
}

const MAX_RESPONSE_SIZE = 1024 * 100; // 100KB

export class ReactNativeEventSource {
	private xhr: XMLHttpRequest | null = null;
	private lastIndex = 0;
	private buffer = "";
	private url: string;
	private options: SSEOptions;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private isClosed = false;

	constructor(url: string, options: SSEOptions) {
		this.url = url;
		this.options = options;
		this.connect();
	}

	private connect() {
		if (this.isClosed) return;

		this.xhr = new XMLHttpRequest();
		this.xhr.open("GET", this.url);

		if (this.options.headers) {
			Object.entries(this.options.headers).forEach(([key, value]) => {
				this.xhr!.setRequestHeader(key, value);
			});
		}

		this.xhr.setRequestHeader("Accept", "text/event-stream");
		this.xhr.setRequestHeader("Cache-Control", "no-cache");

		this.lastIndex = 0;
		this.buffer = "";

		this.xhr.onreadystatechange = () => {
			if (this.xhr?.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
				if (this.xhr.status === 200) {
					this.options.onOpen?.();
				}
			}
		};

		this.xhr.onprogress = () => {
			if (!this.xhr) return;

			const responseText = this.xhr.responseText;

			// 메모리 관리: responseText가 너무 커지면 재연결
			if (responseText.length > MAX_RESPONSE_SIZE) {
				this.xhr.abort();
				this.xhr = null;
				this.lastIndex = 0;
				this.buffer = "";
				this.connect();
				return;
			}

			const newData = responseText.substring(this.lastIndex);
			this.lastIndex = responseText.length;

			this.buffer += newData;

			// SSE 이벤트는 빈 줄(\n\n)로 구분
			const events = this.buffer.split("\n\n");
			this.buffer = events.pop() || "";

			for (const event of events) {
				const lines = event.split("\n");
				for (const line of lines) {
					if (line.startsWith("data:")) {
						const data = line.slice(5).trim();
						if (data) {
							this.options.onMessage(data);
						}
					}
				}
			}
		};

		this.xhr.onerror = () => {
			this.options.onError?.();
			this.scheduleReconnect();
		};

		this.xhr.onloadend = () => {
			if (!this.isClosed) {
				this.scheduleReconnect();
			}
		};

		this.xhr.send();
	}

	private scheduleReconnect() {
		if (this.isClosed || this.reconnectTimer) return;

		const interval = this.options.reconnectInterval ?? 5000;
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect();
		}, interval);
	}

	close() {
		this.isClosed = true;

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.xhr) {
			this.xhr.abort();
			this.xhr = null;
		}
	}
}
