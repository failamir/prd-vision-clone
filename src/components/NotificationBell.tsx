import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle, Calendar, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification, NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

const typeConfig: Record<NotificationType, { icon: typeof Info; color: string; bgColor: string }> = {
    info: { icon: Info, color: "text-blue-500", bgColor: "bg-blue-50" },
    success: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
    warning: { icon: AlertTriangle, color: "text-yellow-500", bgColor: "bg-yellow-50" },
    error: { icon: XCircle, color: "text-red-500", bgColor: "bg-red-50" },
    status_change: { icon: Info, color: "text-purple-500", bgColor: "bg-purple-50" },
    interview: { icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50" },
    departure: { icon: Plane, color: "text-indigo-500", bgColor: "bg-indigo-50" },
};

const NotificationItem = ({
    notification,
    onRead,
    onDelete,
    onNavigate,
}: {
    notification: AppNotification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
    onNavigate: (link: string) => void;
}) => {
    const config = typeConfig[notification.type] || typeConfig.info;
    const IconComponent = config.icon;

    const handleClick = () => {
        if (!notification.is_read) {
            onRead(notification.id);
        }
        if (notification.link) {
            onNavigate(notification.link);
        }
    };

    return (
        <div
            className={`flex items-start gap-3 p-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${!notification.is_read ? "bg-primary/5" : ""
                }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Notification: ${notification.title}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        >
            <div className={`mt-0.5 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                    </p>
                    {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
                {!notification.is_read && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
                        aria-label="Mark as read"
                    >
                        <Check className="w-3 h-3" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                    aria-label="Delete notification"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};

export const NotificationBell = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleNavigate = (link: string) => {
        setOpen(false);
        navigate(link);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs border-2 border-background"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notification List */}
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Bell className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm font-medium">No notifications yet</p>
                        <p className="text-xs mt-1">We'll notify you when something happens</p>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[400px]">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={markAsRead}
                                onDelete={deleteNotification}
                                onNavigate={handleNavigate}
                            />
                        ))}
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    );
};
