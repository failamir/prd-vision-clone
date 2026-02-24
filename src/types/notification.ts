export type NotificationType =
    | "info"
    | "success"
    | "warning"
    | "error"
    | "status_change"
    | "interview"
    | "departure";

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    link: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}
