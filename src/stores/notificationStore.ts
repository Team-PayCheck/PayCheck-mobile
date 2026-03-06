import { create } from "zustand";

interface NotificationStoreState {
	unreadCount: number;
	setUnreadCount: (count: number) => void;
	incrementUnreadCount: () => void;
	decrementUnreadCount: () => void;
	/** SSE로 새 알림이 수신될 때마다 증가. useNotifications에서 감지해 목록을 자동 갱신하는 용도 */
	newNotificationSignal: number;
	signalNewNotification: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
	unreadCount: 0,
	setUnreadCount: (count) => set({ unreadCount: count }),
	incrementUnreadCount: () =>
		set((state) => ({ unreadCount: state.unreadCount + 1 })),
	decrementUnreadCount: () =>
		set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
	newNotificationSignal: 0,
	signalNewNotification: () =>
		set((state) => ({ newNotificationSignal: state.newNotificationSignal + 1 })),
}));
