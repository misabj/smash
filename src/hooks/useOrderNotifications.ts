import { useEffect, useRef, useState, useCallback } from "react";

export interface OrderNotification {
    id: number;
    tracking_code: string;
    customer_name: string | null;
    total: number;
    items: { name: string; quantity: number }[];
    created_at: string;
    receivedAt: number;
}

const NOTIFICATION_SOUND_DATA =
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVYGAACBAAAA";

export function useOrderNotifications() {
    const [notifications, setNotifications] = useState<OrderNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const eventSourceRef = useRef<EventSource | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const dismiss = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const markAllRead = useCallback(() => {
        setUnreadCount(0);
    }, []);

    useEffect(() => {
        // Create notification sound using Web Audio API
        try {
            const audioCtx = new AudioContext();
            const createBeep = () => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                oscillator.type = "sine";
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);
            };
            audioRef.current = { play: createBeep } as any;
        } catch {
            // Fallback
            audioRef.current = new Audio(NOTIFICATION_SOUND_DATA);
        }

        // Connect to SSE
        const es = new EventSource("/api/events");
        eventSourceRef.current = es;

        es.addEventListener("new-order", (e) => {
            try {
                const data = JSON.parse(e.data);
                const notification: OrderNotification = {
                    ...data,
                    receivedAt: Date.now(),
                };

                setNotifications((prev) => [notification, ...prev].slice(0, 20));
                setUnreadCount((prev) => prev + 1);

                // Play sound
                try {
                    if (audioRef.current && "play" in audioRef.current) {
                        (audioRef.current as any).play();
                    }
                } catch { /* ignore audio errors */ }

                // Browser notification
                if (Notification.permission === "granted") {
                    new Notification("🍔 Nova porudžbina!", {
                        body: `${data.customer_name || "Kupac"} — ${data.total.toLocaleString("sr-RS")} RSD`,
                        icon: "/vite.svg",
                    });
                }
            } catch { /* ignore parse errors */ }
        });

        // Request browser notification permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            es.close();
        };
    }, []);

    return { notifications, unreadCount, dismiss, clearAll, markAllRead };
}
