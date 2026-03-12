import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, BrainCircuit, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

const settingsSchema = z.object({
  ai_replies: z.boolean().default(false),
  price_optimization: z.boolean().default(true),
  follow_up_reminders: z.boolean().default(true),
});

interface SmartAssistantSettingsProps {
    settings: z.infer<typeof settingsSchema>;
    onSubmit: (data: z.infer<typeof settingsSchema>) => Promise<void>;
}

export function SmartAssistantSettings({ settings, onSubmit }: SmartAssistantSettingsProps) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: settings,
    });

    const handleFormSubmit = async (data: z.infer<typeof settingsSchema>) => {
        const toastId = toast.loading("Saving AI settings...");
        try {
            await onSubmit(data);
            toast.success("AI settings updated!", { id: toastId });
        } catch (error) {
            toast.error("Failed to save settings.", { id: toastId });
        }
    };

    return (
        <Card className="bg-gradient-to-br from-background to-blue-500/5 border-blue-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-blue-600" /> Smart Assistant (AI)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <Controller name="ai_replies" control={control} render={({ field }) => (
                        <div className="flex items-start gap-3">
                            <Switch {...field} checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                            <div>
                                <Label className="flex items-center gap-2 font-semibold">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Enable AI Replies
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Assistant drafts responses to common inquiries for your review.
                                </p>
                            </div>
                        </div>
                    )} />
                    <Controller name="price_optimization" control={control} render={({ field }) => (
                        <div className="flex items-start gap-3">
                            <Switch {...field} checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                            <div>
                                <Label className="flex items-center gap-2 font-semibold">
                                    <BrainCircuit className="w-3.5 h-3.5 text-purple-500" /> Price Optimization
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Get notified when your listings are overpriced.
                                </p>
                            </div>
                        </div>
                    )} />
                     <Controller name="follow_up_reminders" control={control} render={({ field }) => (
                        <div className="flex items-start gap-3">
                            <Switch {...field} checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                            <div>
                                <Label className="flex items-center gap-2 font-semibold">
                                    <BellRing className="w-3.5 h-3.5 text-orange-500" /> Smart Follow-ups
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                   Remind me to follow up with leads after 48 hours of inactivity.
                                </p>
                            </div>
                        </div>
                    )} />
                    {isDirty && (
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
