import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, Camera, CheckCircle } from "lucide-react";

export default function ProfessionalProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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
          slug: (data.full_name || "professional").toLowerCase().replace(/ /g, '-'),
          specializations: [],
          experience: "2-5",
          languages: ["English", "Kiswahili"],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await supabase.from('profiles').upsert({ id: user?.id, ...profile, updated_at: new Date() });
    toast.success("Profile updated");
    setIsSaving(false);
    setIsDirty(false);
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div className="relative mb-12 group">
        <div className="h-48 bg-gradient-to-r from-slate-900 to-slate-800 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700">
          <div className="absolute inset-0 bg-pattern opacity-10" />
        </div>
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative group/avatar shrink-0">
            <Avatar className="w-28 h-28 border-4 border-background shadow-2xl">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {profile.full_name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mb-3 space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{profile.full_name || "New Professional"}</h1>
            <p className="text-muted-foreground">Your Professional Profile</p>
          </div>
        </div>
      </div>

      {/* Form sections would go here */}

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
