
-- Create verification status enum
CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');

-- Alter profiles table
ALTER TABLE profiles
ADD COLUMN verification_status verification_status DEFAULT 'UNVERIFIED',
ADD COLUMN id_front_url TEXT,
ADD COLUMN id_back_url TEXT,
ADD COLUMN selfie_url TEXT,
ADD COLUMN settings JSONB,
ADD COLUMN payout_method TEXT,
ADD COLUMN mpesa_number TEXT,
ADD COLUMN bank_name TEXT,
ADD COLUMN bank_account TEXT;

-- Create agent_verifications table
CREATE TABLE agent_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status verification_status DEFAULT 'UNVERIFIED',
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    cert_url TEXT,
    brand_logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
