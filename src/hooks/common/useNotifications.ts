import { useState, useEffect, useCallback } from "react";
import {
	getNotifications,
	getUnreadCount,
	readNotification,
	readAllNotifications,
	deleteNotification,
} from "../../api/notification";
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
	const [unreadCount, setUnreadCount] = useState(0);
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
				const items = Array.isArray(data) ? data : data.content ?? [];
				setNotifications(items);
				if (!Array.isArray(data) && data.totalPages !== undefined) {
					setTotalPages(Math.max(1, data.totalPages));
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
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	useEffect(() => {
		fetchUnreadCount();
	}, [fetchUnreadCount]);

	const handleRead = useCallback(async (id: number) => {
		try {
			const response = await readNotification(id);
			if (response.success) {
				setNotifications((prev) =>
					prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
				);
				setUnreadCount((prev) => Math.max(0, prev - 1));
			}
		} catch {
			// silent fail
		}
	}, []);

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
	}, []);

	const handleDelete = useCallback(async (id: number) => {
		try {
			const response = await deleteNotification(id);
			if (response.success) {
				setNotifications((prev) => {
					const deleted = prev.find((n) => n.id === id);
					if (deleted && !deleted.isRead) {
						setUnreadCount((c) => Math.max(0, c - 1));
					}
					return prev.filter((n) => n.id !== id);
				});
			}
		} catch {
			// silent fail
		}
	}, []);

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
