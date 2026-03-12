import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wallet, Smartphone, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

const financialSchema = z.object({
    payout_method: z.enum(['mpesa', 'bank']).default('mpesa'),
    mpesa_number: z.string().optional(),
    bank_name: z.string().optional(),
    bank_account: z.string().optional(),
}).refine(data => {
    if (data.payout_method === 'mpesa') return !!data.mpesa_number;
    if (data.payout_method === 'bank') return !!data.bank_name && !!data.bank_account;
    return true;
}, {
    message: "Please fill in the details for your selected payout method.",
    path: ["payout_method"],
});

interface FinancialSettingsProps {
    settings: z.infer<typeof financialSchema>;
    onSubmit: (data: z.infer<typeof financialSchema>) => Promise<void>;
}

export function FinancialSettings({ settings, onSubmit }: FinancialSettingsProps) {
    const {
        control,
        handleSubmit,
        watch,
        formState: { isSubmitting, isDirty, errors },
    } = useForm<z.infer<typeof financialSchema>>({
        resolver: zodResolver(financialSchema),
        defaultValues: settings,
    });

    const payoutMethod = watch('payout_method');

    const handleFormSubmit = async (data: z.infer<typeof financialSchema>) => {
        const toastId = toast.loading("Saving financial settings...");
        try {
            await onSubmit(data);
            toast.success("Financial settings updated!", { id: toastId });
        } catch (error) {
            toast.error("Failed to save settings.", { id: toastId });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="w-5 h-5 text-green-600" /> Payments & Commissions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <Controller
                        name="payout_method"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-3">
                                <Label>Preferred Payout Method</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => field.onChange('mpesa')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${field.value === 'mpesa' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-muted bg-card hover:bg-accent'}`}>
                                        <Smartphone className="w-4 h-4" /> M-Pesa
                                    </button>
                                    <button type="button" onClick={() => field.onChange('bank')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${field.value === 'bank' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-muted bg-card hover:bg-accent'}`}>
                                        <Building className="w-4 h-4" /> Bank Transfer
                                    </button>
                                </div>
                            </div>
                        )}
                    />

                    {payoutMethod === 'mpesa' && (
                        <Controller name="mpesa_number" control={control} render={({ field }) => (<div className="space-y-2 animate-in fade-in slide-in-from-top-2"><Label>M-Pesa Number</Label><Input {...field} placeholder="+254..." /><p className="text-sm text-red-500">{errors.mpesa_number?.message?.toString()}</p></div>)} />
                    )}

                    {payoutMethod === 'bank' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                           <Controller name="bank_name" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Bank Name</Label><Select {...field} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder="Select Bank" /></SelectTrigger><SelectContent><SelectItem value="kcb">KCB Bank</SelectItem><SelectItem value="equity">Equity Bank</SelectItem><SelectItem value="coop">Co-operative Bank</SelectItem><SelectItem value="ncba">NCBA</SelectItem></SelectContent></Select><p className="text-sm text-red-500">{errors.bank_name?.message?.toString()}</p></div>)} />
                           <Controller name="bank_account" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Account Number</Label><Input {...field} placeholder="Enter account number" /><p className="text-sm text-red-500">{errors.bank_account?.message?.toString()}</p></div>)} />
                        </div>
                    )}
                    
                    {errors.payout_method && <p className="text-sm text-red-500">{errors.payout_method.message}</p>}

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
