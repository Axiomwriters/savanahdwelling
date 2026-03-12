import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, Camera, CheckCircle } from "lucide-react";
import { compressImage, generateFileName, uploadFile } from "@/utils/uploadHelpers";
import { useForm } from "react-hook-form";

// Components
import { IdentitySelector } from "./components/profile/IdentitySelector";
import { TrustBlock } from "./components/profile/TrustBlock";
import { ContactLayer } from "./components/profile/ContactLayer";
import { VerificationSection } from "./components/profile/VerificationSection";
import { PerformanceSnapshot } from "./components/profile/PerformanceSnapshot";
import { PublicProfilePreview } from "./components/profile/PublicProfilePreview";
import { SmartAssistantSettings } from "./components/profile/SmartAssistantSettings";
import { FinancialSettings } from "./components/profile/FinancialSettings";

const defaultProfile = {
  full_name: "",
  avatar_url: "",
  slug: "",
  specializations: [],
  experience: "0-1",
  languages: ["English"],
  bio: "",
  phone: "",
  payout_method: 'mpesa',
  mpesa_number: '',
  bank_name: '',
  bank_account: '',
  verification: {
    status: null,
  },
  settings: {
      ai_replies: false,
      price_optimization: true,
      follow_up_reminders: true,
      allow_whatsapp_replies: true,
      allow_calls: true,
      allow_bookings: false,
      show_phone: true,
      show_whatsapp: true,
  }
};


export default function AgentProfile() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<'individual' | 'agency'>('individual');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
      defaultValues: defaultProfile
  });

  const profile = watch();

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    } else if (!isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from('profiles').select('*, agent_verifications(*)').eq('id', user.id).single();
      
      const settings = { ...defaultProfile.settings, ...(data?.settings || {}) };

      const profileData = {
        ...defaultProfile,
        ...data,
        full_name: data?.full_name || user?.fullName || user?.firstName || "",
        avatar_url: data?.avatar_url || user?.imageUrl || "",
        slug: (data?.full_name || "agent").toLowerCase().replace(/ /g, '-'),
        verification: data?.agent_verifications?.[0] || defaultProfile.verification,
        settings: settings
      };
      reset(profileData);
      if(data?.user_type) {
        setIdentity(data.user_type);
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      if(error.code !== 'PGRST116'){ // Ignore "exact one row" error for new users
        toast.error("Failed to load your profile data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];
    const toastId = toast.loading("Uploading new profile picture...");
    try {
      const compressedFile = await compressImage(file);
      const fileName = generateFileName(compressedFile.type);
      const path = `${user.id}/${fileName}`;
      const { url } = await uploadFile('avatars', path, compressedFile);
      if (url) {
        await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
        setValue('avatar_url', url, { shouldDirty: true });
        toast.success("Profile picture updated!", { id: toastId });
      } else {
        throw new Error("Upload failed to return a URL.");
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "Failed to update profile picture.", { id: toastId });
    }
  };

  const handleUpload = async (file: File, type: string) => {
    if (!user) return null;
    const path = `${user.id}/${type}-${Date.now()}`;
    const { url } = await uploadFile('verification-uploads', path, file);
    return url;
  };

  const submitVerification = async (data: any) => {
    if(!user) return;
    const { error } = await supabase.from('agent_verifications').upsert({ user_id: user.id, ...data, status: 'PENDING_REVIEW' });
    if (error) {
      toast.error(`Verification submission failed: ${error.message}`);
      throw new Error(error.message);
    }
    setValue('verification.status', 'PENDING_REVIEW');
    toast.success("Verification submitted for review!");
  };

  const onSave = async (data: any) => {
    if(!user) return;
    
    // 1. Prepare the data for the 'profiles' table
    const profileUpdate = {
        user_type: identity,
        full_name: data.full_name,
        phone: data.phone,
        bio: data.bio,
        specializations: data.specializations,
        experience: data.experience,
        languages: data.languages,
        slug: data.slug,
        settings: data.settings,
        payout_method: data.payout_method,
        mpesa_number: data.mpesa_number,
        bank_name: data.bank_name,
        bank_account: data.bank_account,
        updated_at: new Date().toISOString(),
    };

    // 2. Upsert the profile data
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...profileUpdate });

    if (error) {
        console.error("Save error:", error);
        toast.error(`Failed to save profile: ${error.message}`);
    } else {
        reset(data); // Resets dirty state
        toast.success("Profile saved successfully!");
    }
  };

  if (loading || !isLoaded) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pt-12">
          <div className="relative group/avatar mx-auto md:mx-0 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <div className={`absolute -inset-1 rounded-full opacity-75 blur-md transition duration-500 group-hover/avatar:opacity-100 ${profile.verification?.status === 'VERIFIED' ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500' : 'bg-primary'}`}></div>
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-[6px] border-background relative z-10 shadow-2xl">
              <AvatarImage src={profile.avatar_url} className="object-cover" />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground">{profile.full_name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all rounded-full backdrop-blur-sm z-20">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/png, image/jpeg" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-5 w-full mt-4 md:mt-0">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                  {profile.full_name || "New Agent"}
                </h1>
                {profile.verification?.status === 'VERIFIED' && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 h-7 text-sm font-medium rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Verified Agent
                  </Badge>
                )}
              </div>
               <p className="text-xl text-emerald-600 font-semibold capitalize">{identity} Agent</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <IdentitySelector selected={identity} onSelect={setIdentity} verified={profile.verification?.status === 'VERIFIED'} />
            <TrustBlock profile={profile} onChange={(k, v) => setValue(k, v, { shouldDirty: true })} />
            {profile.settings && <ContactLayer settings={profile.settings} onChange={(k, v) => setValue(`settings.${k}`, v, { shouldDirty: true })} />}
          </div>
          <div className="space-y-6">
             {profile.verification && <VerificationSection identity={identity} verification={profile.verification} onUpload={handleUpload} onSubmit={submitVerification} />}
             {profile.settings && <SmartAssistantSettings settings={profile.settings} onSubmit={async (data) => setValue('settings', data, { shouldDirty: true })} />}
          </div>
          <div className="space-y-6">
            <PerformanceSnapshot agentId={user?.id} />
            {profile.settings && <PublicProfilePreview slug={profile.slug} settings={profile.settings} onChange={(k, v) => setValue(k === 'slug' ? k : `settings.${k}`, v, { shouldDirty: true })} />}
            <FinancialSettings settings={profile} onSubmit={async (data) => {
                Object.entries(data).forEach(([key, value]) => {
                    setValue(key as any, value, { shouldDirty: true });
                });
            }} />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 right-6 lg:right-12 z-50">
          <Button size="lg" className={`shadow-2xl transition-all duration-300 ${isDirty ? 'scale-100' : 'scale-0'} rounded-full px-8`} type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

      </div>
    </form>
  );
}
