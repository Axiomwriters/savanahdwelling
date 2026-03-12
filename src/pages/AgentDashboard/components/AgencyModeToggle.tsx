import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Building2, User } from "lucide-react";
import { toast } from "sonner";

export default function AgencyModeToggle() {
    const { user, isLoaded } = useUser();
    const [isAgencyMode, setIsAgencyMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            const fetchUserType = async () => {
                setIsLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('user_type')
                        .eq('id', user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') {
                        throw error;
                    }
                    if (data) {
                        setIsAgencyMode(data.user_type === 'agency');
                    }
                } catch (error: any) {
                    console.error("Error fetching user type:", error);
                    toast.error("Failed to load your identity.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserType();
        }
    }, [isLoaded, user]);

    const handleToggle = async (isToggled: boolean) => {
        if (!user) return;

        const newMode = isToggled ? 'agency' : 'individual';
        setIsAgencyMode(isToggled); // Optimistic UI update

        const toastId = toast.loading(`Switching to ${newMode} mode...`);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ user_type: newMode })
                .eq('id', user.id);

            if (error) {
                throw error;
            }
            toast.success(`Switched to ${newMode} mode!`, { id: toastId });

        } catch (error: any) {
            setIsAgencyMode(!isToggled); // Revert on error
            console.error("Failed to update user type:", error);
            toast.error(`Failed to switch mode: ${error.message}`, { id: toastId });
        }
    };

    return (
        <div className={`flex items-center gap-3 bg-secondary/30 p-2 rounded-full border transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${!isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Agent</span>
            </div>

            <Switch
                checked={isAgencyMode}
                onCheckedChange={handleToggle}
                disabled={isLoading}
                className="data-[state=checked]:bg-primary"
            />

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Agency</span>
            </div>
        </div>
    );
}
