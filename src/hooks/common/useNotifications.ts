import { useState, useEffect, useCallback } from "react";
import {
	getNotifications,
	getUnreadCount,
	readNotification,
	readAllNotifications,
	deleteNotification,
} from "../../api/notification";
import { useNotificationStore } from "../../stores/notificationStore";
import type {
	NotificationResponse,
	NotificationListParams,
} from "../../api/notification/types";

const PAGE_SIZE = 10;

interface UseNotificationsReturn {
	notifications: NotificationResponse[];
	unreadCount: number;
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	isReadFilter: boolean | undefined;
	setIsReadFilter: (filter: boolean | undefined) => void;
	fetchNotifications: () => Promise<void>;
	fetchUnreadCount: () => Promise<void>;
	handleRead: (id: number) => Promise<void>;
	handleReadAll: () => Promise<void>;
	handleDelete: (id: number) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
	const [notifications, setNotifications] = useState<NotificationResponse[]>(
		[]
	);
	const { unreadCount, setUnreadCount, decrementUnreadCount, newNotificationSignal } =
		useNotificationStore();
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(
		undefined
	);

	const fetchNotifications = useCallback(async () => {
		setIsLoading(true);
		try {
			const params: NotificationListParams = {
				page: currentPage,
				size: PAGE_SIZE,
			};
			if (isReadFilter !== undefined) {
				params.is_read = isReadFilter;
			}
			const response = await getNotifications(params);
			if (response.success && response.data) {
				const data = response.data;
				setNotifications(data.notifications ?? []);
				setTotalPages(Math.max(1, data.totalPages));
				if (data.unreadCount !== undefined) {
					setUnreadCount(data.unreadCount);
				}
			}
		} catch {
			// silent fail
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, isReadFilter]);

	const fetchUnreadCount = useCallback(async () => {
		try {
			const response = await getUnreadCount();
			if (response.success && response.data) {
				setUnreadCount(response.data.count);
			}
		} catch {
			// silent fail
		}
	}, [setUnreadCount]);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	useEffect(() => {
		fetchUnreadCount();
	}, [fetchUnreadCount]);

	// SSE로 새 알림 수신 시 목록 자동 갱신 (초기값 0은 건너뜀)
	useEffect(() => {
		if (newNotificationSignal === 0) return;
		fetchNotifications();
	}, [newNotificationSignal]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleRead = useCallback(
		async (id: number) => {
			try {
				const response = await readNotification(id);
				if (response.success) {
					setNotifications((prev) =>
						prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
					);
					decrementUnreadCount();
				}
			} catch {
				// silent fail
			}
		},
		[decrementUnreadCount]
	);

	const handleReadAll = useCallback(async () => {
		try {
			const response = await readAllNotifications();
			if (response.success) {
				setNotifications((prev) =>
					prev.map((n) => ({ ...n, isRead: true }))
				);
				setUnreadCount(0);
			}
		} catch {
			// silent fail
		}
	}, [setUnreadCount]);

	const handleDelete = useCallback(
		async (id: number) => {
			try {
				const response = await deleteNotification(id);
				if (response.success) {
					const deleted = notifications.find((n) => n.id === id);
					if (deleted && !deleted.isRead) {
						decrementUnreadCount();
					}
					setNotifications((prev) => prev.filter((n) => n.id !== id));
				}
			} catch {
				// silent fail
			}
		},
		[notifications, decrementUnreadCount]
	);

	return {
		notifications,
		unreadCount,
		isLoading,
		currentPage,
		totalPages,
		setCurrentPage,
		isReadFilter,
		setIsReadFilter,
		fetchNotifications,
		fetchUnreadCount,
		handleRead,
		handleReadAll,
		handleDelete,
	};
}
