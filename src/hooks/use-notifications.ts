import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import type { AppNotification } from "@/types/notification";

interface UseNotificationsReturn {
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
}

// Use `any` cast for supabase.from() since the `notifications` table
// won't be in the auto-generated types until `supabase gen types` is re-run.
const notificationsTable = () => (supabase as any).from("notifications");

export const useNotifications = (): UseNotificationsReturn => {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await notificationsTable()
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            setNotifications((data as AppNotification[]) || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Subscribe to real-time changes
    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const channel = supabase
            .channel(`notifications:${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newNotification = payload.new as AppNotification;
                    setNotifications((prev) => [newNotification, ...prev]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const updated = payload.new as AppNotification;
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === updated.id ? updated : n))
                    );
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const deleted = payload.old as { id: string };
                    setNotifications((prev) => prev.filter((n) => n.id !== deleted.id));
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [user, fetchNotifications]);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const markAsRead = useCallback(
        async (id: string) => {
            if (!user) return;
            try {
                const { error } = await notificationsTable()
                    .update({ is_read: true })
                    .eq("id", id)
                    .eq("user_id", user.id);

                if (error) throw error;

                // Optimistic update
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
                );
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        },
        [user]
    );

    const markAllAsRead = useCallback(async () => {
        if (!user) return;
        try {
            const { error } = await notificationsTable()
                .update({ is_read: true })
                .eq("user_id", user.id)
                .eq("is_read", false);

            if (error) throw error;

            // Optimistic update
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    }, [user]);

    const deleteNotification = useCallback(
        async (id: string) => {
            if (!user) return;
            try {
                const { error } = await notificationsTable()
                    .delete()
                    .eq("id", id)
                    .eq("user_id", user.id);

                if (error) throw error;

                // Optimistic update
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        },
        [user]
    );

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refetch: fetchNotifications,
    };
};
