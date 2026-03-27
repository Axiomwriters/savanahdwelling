
-- Verification Sessions Table
-- Tracks 48-hour verification windows for agent/host onboarding

CREATE TABLE IF NOT EXISTS public.verification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('agent', 'host')),
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    
    -- Document uploads
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    
    -- Phone verification
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    otp_code TEXT,
    otp_expires_at TIMESTAMPTZ,
    otp_attempts INTEGER DEFAULT 0,
    
    -- Expiry tracking (48 hours from creation)
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_verification_sessions_user_id ON verification_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_token ON verification_sessions(token);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_expires_at ON verification_sessions(expires_at);

-- RLS Policies
ALTER TABLE public.verification_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own verification sessions
CREATE POLICY "users_manage_own_verification_sessions"
    ON verification_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Function to clean up expired verification sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_verification_sessions()
RETURNS void AS $$
BEGIN
    UPDATE verification_sessions 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_verification_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verification_sessions_updated_at
    BEFORE UPDATE ON verification_sessions
    FOR EACH ROW EXECUTE FUNCTION update_verification_sessions_updated_at();
