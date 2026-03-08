import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, Camera, CheckCircle, Trophy, Star, Sparkles } from "lucide-react";
import { compressImage, generateFileName, uploadFile } from "@/utils/uploadHelpers";

// Components
import { IdentitySelector } from "./components/profile/IdentitySelector";
import { TrustBlock } from "./components/profile/TrustBlock";
import { ContactLayer } from "./components/profile/ContactLayer";
import { VerificationSection } from "./components/profile/VerificationSection";
import { PerformanceSnapshot } from "./components/profile/PerformanceSnapshot";
import { PublicProfilePreview } from "./components/profile/PublicProfilePreview";
import { SmartAssistantSettings } from "./components/profile/SmartAssistantSettings";
import { FinancialSettings } from "./components/profile/FinancialSettings";

export default function AgentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Core Identity State
  const [identity, setIdentity] = useState<'individual' | 'agency'>('individual');

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
    specializations: [],
    experience: "0-1",
    languages: ["English"],
    bio: "",
    slug: "",
  });

  // Settings State (Mocked for now)
  const [agencyForm, setAgencyForm] = useState({});
  const [verification, setVerification] = useState({
    status: null,
    id_front_url: "",
    id_back_url: "",
    selfie_url: "",
    cert_url: "",
    brand_logo_url: "",
  });

  const [crmSettings, setCrmSettings] = useState({
    allow_whatsapp_replies: true,
    allow_calls: true,
    allow_bookings: false,
    show_phone: true,
    show_whatsapp: true,
  });

  const [aiSettings, setAiSettings] = useState({
    ai_replies: false,
    price_optimization: true,
    follow_up_reminders: true,
  });

  const [financialSettings, setFinancialSettings] = useState({
    payout_method: 'mpesa',
    mpesa_number: '',
    bank_name: '',
    bank_account: '',
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          slug: (data.full_name || "agent").toLowerCase().replace(/ /g, '-'),
          specializations: [],
          experience: "2-5",
          languages: ["English", "Kiswahili"],
        });
        // Mock loading other settings if they existed
      }

      const { data: verif } = await supabase.from('agent_verifications').select('*').eq('user_id', user?.id).maybeSingle();
      if (verif) {
        setVerification({ ...verif });
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
        return;
    }
    const file = event.target.files[0];
    const toastId = toast.loading("Uploading new profile picture...");
    try {
        const compressedFile = await compressImage(file);
        const fileName = generateFileName(compressedFile.type);
        const path = `${user.id}/${fileName}`;
        const { url } = await uploadFile('avatars', path, compressedFile);

        if (url) {
            await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
            setProfile(prev => ({ ...prev, avatar_url: url }));
            toast.success("Profile picture updated!", { id: toastId });
        } else {
            throw new Error("Upload failed to return a URL.");
        }
    } catch (error: any) {
        console.error("Avatar upload error:", error);
        toast.error(error.message || "Failed to update profile picture.", { id: toastId });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In real app, we would upsert to multiple tables
    await supabase.from('profiles').upsert({ id: user?.id, ...profile, updated_at: new Date() });

    toast.success("Profile & Settings updated");
    setIsSaving(false);
    setIsDirty(false);
  };

  const handleUpload = async (file: File, type: string) => {
    const path = `${user?.id}/${type}-${Date.now()}`;
    const { url } = await uploadFile('verification-docs', path, file);
    if (url) {
      setVerification(prev => ({ ...prev, [`${type}_url`]: url }));
      return url;
    }
    return null;
  };

  const submitVerification = async () => {
    // In real app: upsert to agent_verifications table with status 'pending'
    setVerification(prev => ({ ...prev, status: 'pending' }));
    toast.success("Verification submitted!");
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto">

      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pt-12">
        {/* Avatar Area */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-start shrink-0">
          <div 
            className="relative group/avatar mx-auto md:mx-0 cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            <div className={`absolute -inset-1 rounded-full opacity-75 blur-md transition duration-500 group-hover/avatar:opacity-100 ${verification.status === 'approved' ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500' : 'bg-primary'}`}></div>
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-[6px] border-background relative z-10 shadow-2xl">
              <AvatarImage src={profile.avatar_url} className="object-cover" />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground">{profile.full_name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all rounded-full backdrop-blur-sm z-20">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/png, image/jpeg"
            />
          </div>
        </div>
        {/* Info Area */}
        <div className="flex-1 text-center md:text-left space-y-5 w-full mt-4 md:mt-0">
          <div>
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                {profile.full_name || "New Agent"}
              </h1>
              {verification.status === 'approved' && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 h-7 text-sm font-medium rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Verified Agent
                </Badge>
              )}
            </div>
            <p className="text-xl text-emerald-600 font-semibold">{identity === 'agency' ? 'Registered Agency' : 'Real Estate Agent'}</p>
            {profile.specializations && profile.specializations.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3 text-muted-foreground">
                <span className="text-sm font-medium mr-1 text-foreground/80">Specializes in:</span>
                {profile.specializations.map((spec: string, i: number) => (
                  <span key={spec} className="flex items-center text-sm">
                    {i > 0 && <span className="mx-2 opacity-30">·</span>}
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Identity & Trust */}
        <div className="space-y-6">
          <IdentitySelector
            selected={identity}
            onSelect={setIdentity}
            verified={verification.status === 'approved'}
          />

          <TrustBlock
            profile={profile}
            onChange={(k, v) => { setProfile(p => ({ ...p, [k]: v })); setIsDirty(true); }}
          />

          <ContactLayer
            settings={crmSettings}
            onChange={(k, v) => { setCrmSettings(s => ({ ...s, [k]: v })); setIsDirty(true); }}
          />
        </div>

        {/* MIDDLE COLUMN: Verification & Profile Data */}
        <div className="space-y-6">
          <VerificationSection
            identity={identity}
            verification={verification}
            onUpload={handleUpload}
            onSubmit={submitVerification}
            formState={agencyForm}
            onFormChange={(k, v) => setAgencyForm(prev => ({ ...prev, [k]: v }))}
          />

          <SmartAssistantSettings
            settings={aiSettings}
            onChange={(k, v) => { setAiSettings(s => ({ ...s, [k]: v })); setIsDirty(true); }}
          />
        </div>

        {/* RIGHT COLUMN: Performance & Public Preview */}
        <div className="space-y-6">
          <PerformanceSnapshot />

          <PublicProfilePreview
            slug={profile.slug}
            settings={crmSettings}
            onChange={(k, v) => {
              if (k === 'slug') setProfile(p => ({ ...p, slug: v }));
              else setCrmSettings(s => ({ ...s, [k]: v }));
              setIsDirty(true);
            }}
          />

          <FinancialSettings
            settings={financialSettings}
            onChange={(k, v) => { setFinancialSettings(s => ({ ...s, [k]: v })); setIsDirty(true); }}
          />
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 lg:right-12 z-50">
        <Button
          size="lg"
          className={`shadow-2xl transition-all duration-300 ${isDirty ? 'scale-100' : 'scale-0'} rounded-full px-8`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

    </div>
  );
}
