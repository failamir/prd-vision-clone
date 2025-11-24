import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
  sender: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  recipient: {
    id: string;
    full_name: string;
    email: string;
  };
};

type Conversation = {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  subject?: string;
};

export default function AdminMessageCenter() {
  const { user } = useUser();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [mode, setMode] = useState<'reply' | 'compose'>('reply');
  const [composeRecipient, setComposeRecipient] = useState<string>('');
  const [profilesById, setProfilesById] = useState<Record<string, { full_name: string; email?: string; avatar_url?: string; role?: 'User' | 'Candidate' | 'Reviewer' }>>({});
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [recipientQuery, setRecipientQuery] = useState<string>('');
  const [recipientResults, setRecipientResults] = useState<Array<{ id: string; full_name: string; email?: string; avatar_url?: string; role?: 'User' | 'Candidate' }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all conversations for the admin
  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get all unique users who have messaged the admin (using receiver_id schema)
      const { data: incoming, error: incErr } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id);

      const { data: outgoing, error: outErr } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id);

      if (incErr || outErr) throw incErr || outErr;

      const allUserIds = new Set<string>();
      (incoming || []).forEach(m => allUserIds.add(m.sender_id));
      (outgoing || []).forEach(m => allUserIds.add(m.receiver_id));
      // remove self id from list
      if (user?.id) allUserIds.delete(user.id);

      // Get unique users and their latest message
      const uniqueUsers = new Map();
      
      const ids = Array.from(allUserIds);
      // fetch profiles for these ids, trying 'profiles' then falling back to 'candidate_profiles'
      let profilesMap: Record<string, { full_name: string; email: string; avatar_url?: string }> = {};
      if (ids.length) {
        let profilesData: any[] | null = null;
        let profilesErr: any = null;
        const tryFetch = async (table: string) => {
          const { data, error } = await supabase
            .from(table)
            .select('id, full_name, email, avatar_url')
            .in('id', ids);
          return { data, error };
        };
        // attempt profiles
        const a = await tryFetch('profiles');
        if (!a.error && a.data) {
          profilesData = a.data as any[];
        } else {
          // attempt candidate_profiles
          const b = await tryFetch('candidate_profiles');
          profilesErr = b.error;
          profilesData = b.data as any[];
        }
        if (profilesData) {
          profilesMap = Object.fromEntries(
            profilesData.map((p: any) => [p.id, { full_name: p.full_name ?? 'Unknown', email: p.email ?? '', avatar_url: p.avatar_url }])
          );
        }
      }

      for (const uid of ids) {
        const prof = profilesMap[uid];
        uniqueUsers.set(uid, {
          userId: uid,
          userName: prof?.full_name || uid,
          userEmail: prof?.email || '',
          userAvatar: prof?.avatar_url,
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0
        });
      }

      // Get last message and unread count for each conversation
      const conversationsList = Array.from(uniqueUsers.values());
      
      for (const conv of conversationsList) {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conv.userId}),and(sender_id.eq.${conv.userId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (lastMessage) {
          conv.lastMessage = (lastMessage as any).content ?? (lastMessage as any).message ?? '';
          conv.lastMessageTime = lastMessage.created_at;
          (conv as any).subject = (lastMessage as any).subject || '';
        }

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', conv.userId)
          .eq('receiver_id', user.id)
          .eq('is_read', false);

        conv.unreadCount = count || 0;
      }

      setConversations(conversationsList);
      
      // Select first conversation by default
      if (conversationsList.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsList[0].userId);
      }
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    if (!user) return;
    
    try {
      setLoadingMessages(true);
      
      // First, get all messages between the current user and the selected user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', messagesData);
      
      // Transform the data to match our Message type
      const formattedMessages = (messagesData || []).map((msg: any) => ({
        id: msg.id,
        content: msg.content ?? msg.message, // support old column name
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        created_at: msg.created_at,
        read_at: msg.read_at,
        sender: {
          id: msg.sender_id,
          full_name: '',
          email: '',
          avatar_url: undefined
        },
        recipient: {
          id: msg.receiver_id,
          full_name: '',
          email: ''
        }
      }));
      
      setMessages(formattedMessages);

      // Fetch sender/receiver profiles for labels
      const idsSet = new Set<string>();
      (messagesData || []).forEach((m: any) => { idsSet.add(m.sender_id); idsSet.add(m.receiver_id); });
      const ids = Array.from(idsSet).filter(Boolean);
      if (ids.length) {
        const fetchProfiles = async (table: string) => {
          return await supabase
            .from(table)
            .select('id, full_name, email, avatar_url')
            .in('id', ids);
        };
        let map: Record<string, { full_name: string; email?: string; avatar_url?: string; role?: 'User' | 'Candidate' | 'Reviewer' }> = {};
        const a = await fetchProfiles('profiles');
        if (!a.error && a.data) {
          map = Object.fromEntries((a.data as any[]).map(p => [p.id, { full_name: p.full_name ?? 'Unknown', email: p.email, avatar_url: p.avatar_url, role: 'User' }]));
        } else {
          const b = await fetchProfiles('candidate_profiles');
          if (!b.error && b.data) {
            map = Object.fromEntries((b.data as any[]).map(p => [p.id, { full_name: p.full_name ?? 'Unknown', email: p.email, avatar_url: p.avatar_url, role: 'Candidate' }]));
          }
        }
        setProfilesById(map);
      }

      // Determine latest subject for this conversation (if any)
      if (messagesData && messagesData.length > 0) {
        const last = messagesData[messagesData.length - 1] as any;
        setCurrentSubject(last?.subject || '');
      } else {
        setCurrentSubject('');
      }
      
      // Mark messages as read if they're from the other user
      if (userId !== user.id) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('sender_id', userId)
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
        if (updateError) {
          console.error('Error updating read status:', updateError);
        }
        
        // Update unread count in conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.userId === userId 
              ? { ...conv, unreadCount: 0 } 
              : conv
          )
        );
      }
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = mode === 'reply' ? replyMessage : composeMessage;
    if (!body.trim() || !user) return;
    // decide target recipient atomically to avoid setState race
    const targetRecipient = mode === 'compose' ? (composeRecipient || selectedConversation) : selectedConversation;
    if (!targetRecipient) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            message: body,
            sender_id: user.id,
            receiver_id: targetRecipient,
            subject: (mode === 'reply') ? (currentSubject ? `Re: ${currentSubject}` : 'Re:') : (composeSubject || ''),
            is_read: false,
          },
        ])
        .select();

      if (error) throw error;

      // Add the new message to the list
      if (data?.[0]) {
        const newMsg = {
          ...data[0],
          sender: {
            id: user.id,
            full_name: 'You',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url
          },
          recipient: {
            id: targetRecipient,
            full_name: conversations.find(c => c.userId === targetRecipient)?.userName || 'User',
            email: conversations.find(c => c.userId === targetRecipient)?.userEmail || ''
          },
          content: (data[0] as any).content ?? (data[0] as any).message
        };
        
        setMessages([...messages, newMsg]);
        if (mode === 'reply') {
          setReplyMessage('');
        } else {
          setComposeMessage('');
        }
        if (mode === 'compose') {
          setComposeRecipient('');
          setComposeSubject('');
        }
        
        // Update last message in conversations
        updateLastMessage(targetRecipient, body, new Date().toISOString());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Update last message in conversations list
  const updateLastMessage = (userId: string, message: string, timestamp: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.userId === userId 
          ? { 
              ...conv, 
              lastMessage: message, 
              lastMessageTime: timestamp 
            } 
          : conv
      )
    );
  };

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessageRaw = payload.new as any;
          const newMessage = { ...newMessageRaw, content: newMessageRaw.content ?? newMessageRaw.message } as Message;
          
          // If message is in current conversation, add it
          if (selectedConversation === newMessage.sender_id) {
            setMessages(prev => [...prev, newMessage]);
            
            // Mark as read
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id);
          } 
          // Otherwise update unread count
          else {
            setConversations(prev => 
              prev.map(conv => 
                conv.userId === newMessage.sender_id
                  ? { 
                      ...conv, 
                      lastMessage: newMessage.content,
                      lastMessageTime: newMessage.created_at,
                      unreadCount: conv.unreadCount + 1 
                    } 
                  : conv
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedConversation]);

  // Load conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Read preselected user from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pre = params.get('selected');
    if (pre && pre !== user?.id) {
      setSelectedConversation(pre);
    }
  }, [location.search]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Search recipients for compose mode
  useEffect(() => {
    const run = async () => {
      if (!recipientQuery || mode !== 'compose') { setRecipientResults([]); return; }
      const q = `%${recipientQuery}%`;
      // profiles
      const p = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .ilike('full_name', q);
      // candidate_profiles fallback
      const c = await supabase
        .from('candidate_profiles')
        .select('id, full_name, email, avatar_url')
        .ilike('full_name', q);
      const arr: any[] = [];
      if (p.data) arr.push(...p.data.map((x: any) => ({ ...x, role: 'User' as const })));
      if (c.data) arr.push(...c.data.map((x: any) => ({ ...x, role: 'Candidate' as const })));
      // de-dup by id
      const uniq = Array.from(new Map(arr.map(i => [i.id, i])).values());
      setRecipientResults(uniq);
    };
    const t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [recipientQuery, mode]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current conversation details
  const currentConversation = conversations.find(c => c.userId === selectedConversation);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading conversations...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Link to="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Message Center</h1>
        <div className="w-24"></div> {/* For alignment */}
      </div>
      
      <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
        {/* Sidebar with conversations */}
        <div className="w-80 border-r flex flex-col">
          {/* Conversations list */}
          {filteredConversations.map((conv) => (
              <div
                key={conv.userId}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                  selectedConversation === conv.userId ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conv.userId)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={conv.userAvatar} />
                  <AvatarFallback>
                    {conv.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conv.userName}</h3>
                    <span className="text-xs text-gray-500">
                      {format(new Date(conv.lastMessageTime), 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={currentConversation?.userAvatar} />
                <AvatarFallback>
                  {currentConversation?.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{profilesById[selectedConversation || '']?.full_name || currentConversation?.userName || selectedConversation}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {(profilesById[selectedConversation || '']?.role) || 'User'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Conversation: <span className="font-medium">Admin (You)</span> ↔ <span className="font-medium">{profilesById[selectedConversation || '']?.full_name || currentConversation?.userName || 'User'}</span>{currentSubject ? ` • Subject: ${currentSubject}` : ''}</p>
                {currentConversation?.userEmail && (
                  <p className="text-sm text-gray-500">{currentConversation.userEmail}</p>
                )}
              </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={mode === 'reply' ? 'default' : 'outline'} size="sm" onClick={() => setMode('reply')}>Reply</Button>
                <Button variant={mode === 'compose' ? 'default' : 'outline'} size="sm" onClick={() => setMode('compose')}>New Message</Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          message.sender_id === user?.id
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 border border-slate-200 rounded-bl-sm'
                        }`}
                      >
                        <div className="text-[11px] opacity-80 mb-1">
                          {message.sender_id === user?.id ? 'Admin (You)' : (profilesById[message.sender_id]?.full_name || currentConversation?.userName || 'User')}
                        </div>
                        <div className="text-sm">{(message as any).message ?? message.content}</div>
                        <div className={`text-[10px] mt-1 ${
                          message.sender_id === user?.id ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.created_at), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              // Do NOT change selectedConversation when composing; sendMessage computes targetRecipient
              sendMessage(e as any);
            }} className="p-4 border-t space-y-2">
              {mode === 'reply' && (
                <div className="text-xs text-muted-foreground">
                  Replying to: <span className="font-medium">{profilesById[selectedConversation || '']?.full_name || currentConversation?.userName || selectedConversation}</span>{profilesById[selectedConversation || '']?.role ? ` (${profilesById[selectedConversation || '']?.role})` : ''}{currentSubject ? ` • Subject: ${currentSubject}` : ''}
                </div>
              )}
              {mode === 'compose' && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      value={recipientQuery}
                      onChange={(e) => setRecipientQuery(e.target.value)}
                      placeholder="Search recipient by name..."
                      className="flex-1"
                    />
                    <Input
                      value={composeRecipient}
                      onChange={(e) => setComposeRecipient(e.target.value)}
                      placeholder="Or paste user id"
                      className="w-[300px]"
                    />
                  </div>
                  {recipientResults.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border rounded-md divide-y">
                      {recipientResults.map(r => (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => { setComposeRecipient(r.id); setRecipientQuery(r.full_name); }}
                          className="w-full text-left p-2 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={r.avatar_url} />
                            <AvatarFallback>{r.full_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{r.full_name} <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-slate-100 border text-slate-600">{r.role || 'User'}</span></div>
                            <div className="text-xs text-muted-foreground">{r.email}</div>
                            <div className="text-[10px] text-muted-foreground">{r.id}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <Input
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Subject"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  value={mode === 'compose' ? composeMessage : replyMessage}
                  onChange={(e) => (mode === 'compose' ? setComposeMessage(e.target.value) : setReplyMessage(e.target.value))}
                  placeholder={mode === 'compose' ? 'Type a new message...' : 'Type your reply...'}
                  className="flex-1"
                />
                <Button type="submit" disabled={!(mode === 'compose' ? composeMessage.trim() : replyMessage.trim()) || (mode === 'compose' && !composeRecipient.trim())}>
                  {mode === 'compose' ? 'Send Message' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
