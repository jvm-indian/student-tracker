-- Run this entire script in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. Create the missing UPDATE policy for messages
CREATE POLICY "messages_update" ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- 2. Add the messages table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
