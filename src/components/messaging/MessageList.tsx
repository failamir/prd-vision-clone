import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

type Message = {
  id: string;
  message?: string; // new schema
  content?: string; // backward compatibility
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read?: boolean | null;
  sender: {
    full_name: string;
    avatar_url?: string;
  };
};

export default function MessageList({ peerId }: { peerId?: string }) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterCondition = useMemo(() => {
    if (!user) return '';
    if (peerId) {
      return `and(sender_id.eq.${user.id},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${user.id})`;
    }
    return `sender_id.eq.${user.id},receiver_id.eq.${user.id}`;
  }, [user, peerId]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(`*, sender:profiles!messages_sender_id_fkey(full_name,avatar_url)`) // profiles join optional
        .or(filterCondition)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    if (!peerId) {
      setError("No recipient selected");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ message: newMessage, sender_id: user.id, receiver_id: peerId, is_read: false }])
        .select();

      if (error) throw error;

      // Add the new message to the list
      if (data?.[0]) {
        setMessages([...messages, {
          ...data[0],
          sender: {
            full_name: user.user_metadata?.full_name || 'You',
            avatar_url: user.user_metadata?.avatar_url
          }
        } as any]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user?.id}`
        },
        (payload) => {
          const nm = payload.new as any;
          if (!peerId || nm.sender_id === peerId) {
            setMessages(prev => [...prev, nm]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Mark messages as read when they're viewed
  useEffect(() => {
    const markAsRead = async () => {
      const unreadMessages = messages.filter(
        (msg: any) => msg.receiver_id === user?.id && (msg.is_read === false || msg.is_read == null)
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg.id);
        await supabase
          .from("messages")
          .update({ is_read: true })
          .in("id", messageIds);
      }
    };

    markAsRead();
  }, [messages, user]);

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={message.sender?.avatar_url} />
                    <AvatarFallback>
                      {message.sender?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {message.sender_id === user?.id ? 'You' : message.sender?.full_name || 'User'}
                  </span>
                </div>
                <p className="text-sm">{message.message ?? message.content}</p>
                <div className="text-xs text-right mt-1 opacity-70">
                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            rows={1}
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
