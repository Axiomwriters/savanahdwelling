import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileUpload } from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Shield, User, MapPin, AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const individualSchema = z.object({
  id_front_url: z.string().min(1, "National ID (Front) is required."),
  id_back_url: z.string().min(1, "National ID (Back) is required."),
  selfie_url: z.string().min(1, "Selfie with ID is required."),
});

const agencySchema = z.object({
  agency_name: z.string().min(3, "Agency name is required."),
  reg_number: z.string().min(1, "Registration number is required."),
  kra_pin: z.string().min(11, "KRA PIN is required."),
  office_phone: z.string().optional(),
  cert_incorp_url: z.string().min(1, "Certificate of Incorporation is required."),
  brand_logo_url: z.string().optional(),
  office_address: z.string().optional(),
});

interface VerificationSectionProps {
    identity: 'individual' | 'agency';
    verification: any; 
    onUpload: (file: File, type: string) => Promise<string | null>;
    onSubmit: (data: any) => Promise<void>;
}

export function VerificationSection({
    identity,
    verification,
    onUpload,
    onSubmit,
}: VerificationSectionProps) {
    const isIndividual = identity === 'individual';
    const validationSchema = isIndividual ? individualSchema : agencySchema;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isValid },
        watch
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: verification || {},
    });
    
    const isApproved = verification?.status === 'VERIFIED';
    const isPending = verification?.status === 'PENDING_REVIEW';
    const isRejected = verification?.status === 'REJECTED';

    const handleFileUpload = async (file: File, field: any) => {
        const toastId = toast.loading(`Uploading ${file.name}...`);
        try {
            const url = await onUpload(file, field);
            if (url) {
                setValue(field, url, { shouldValidate: true });
                toast.success("File uploaded successfully!", { id: toastId });
            } else {
                throw new Error("Upload failed to return a URL.");
            }
        } catch (error: any) {
            toast.error(error.message || "File upload failed.", { id: toastId });
        }
    };

    return (
        <Card className="border-t-4 border-t-primary shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {isIndividual ? <User className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-primary" />}
                        {isIndividual ? 'Identity Verification' : 'Agency Verification'}
                    </CardTitle>
                    <Badge variant={isApproved ? "default" : "outline"} className={isApproved ? "bg-green-100 text-green-700" : ""}>
                        {verification?.status?.replace('_', ' ') || 'NOT VERIFIED'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                {isPending && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/50">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <AlertTitle>Under Review</AlertTitle>
                        <AlertDescription>Your documents are being reviewed. Expected time: 24h.</AlertDescription>
                    </Alert>
                )}
                {isRejected && (
                    <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertTitle>Verification Rejected</AlertTitle>
                        <AlertDescription>{verification.rejection_reason || "Please review your documents and resubmit."}</AlertDescription>
                    </Alert>
                )}
                {isApproved && (
                     <Alert variant="success">
                        <CheckCircle className="w-4 h-4" />
                        <AlertTitle>Profile Verified</AlertTitle>
                        <AlertDescription>Your identity has been successfully verified.</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {isIndividual ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <Controller name="id_front_url" control={control} render={({ field }) => ( <FileUpload label="National ID (Front)" onUpload={(f) => handleFileUpload(f, 'id_front_url')} preview={field.value} error={errors.id_front_url?.message?.toString()} disabled={isApproved || isSubmitting} /> )} />
                               <Controller name="id_back_url" control={control} render={({ field }) => ( <FileUpload label="National ID (Back)" onUpload={(f) => handleFileUpload(f, 'id_back_url')} preview={field.value} error={errors.id_back_url?.message?.toString()} disabled={isApproved || isSubmitting} /> )} />
                            </div>
                            <div className="md:w-1/2 pr-2">
                                <Controller name="selfie_url" control={control} render={({ field }) => ( <FileUpload label="Selfie with ID" onUpload={(f) => handleFileUpload(f, 'selfie_url')} preview={field.value} error={errors.selfie_url?.message?.toString()} disabled={isApproved || isSubmitting} /> )} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller name="agency_name" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Registered Agency Name</Label><Input {...field} placeholder="e.g. Kamau Properties Ltd" disabled={isApproved || isSubmitting} /><p className="text-sm text-red-500">{errors.agency_name?.message?.toString()}</p></div> )} />
                                <Controller name="reg_number" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Registration Number / ID</Label><Input {...field} placeholder="e.g. CPR/2023/..." disabled={isApproved || isSubmitting} /><p className="text-sm text-red-500">{errors.reg_number?.message?.toString()}</p></div> )} />
                                <Controller name="kra_pin" control={control} render={({ field }) => ( <div className="space-y-2"><Label>KRA PIN (Agency)</Label><Input {...field} placeholder="P05..." disabled={isApproved || isSubmitting} /><p className="text-sm text-red-500">{errors.kra_pin?.message?.toString()}</p></div> )} />
                                <Controller name="office_phone" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Office Phone</Label><Input {...field} placeholder="+254 700 000 000" disabled={isApproved || isSubmitting} /></div> )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller name="cert_incorp_url" control={control} render={({ field }) => ( <FileUpload label="Certificate of Incorporation" onUpload={(f) => handleFileUpload(f, 'cert_incorp_url')} preview={field.value} error={errors.cert_incorp_url?.message?.toString()} disabled={isApproved || isSubmitting} accept=".pdf,image/*" maxSize={10} /> )} />
                                <Controller name="brand_logo_url" control={control} render={({ field }) => ( <FileUpload label="Agency Logo (Brand Asset)" onUpload={(f) => handleFileUpload(f, 'brand_logo_url')} preview={field.value} error={errors.brand_logo_url?.message?.toString()} disabled={isApproved || isSubmitting} /> )} />
                            </div>
                            <Controller name="office_address" control={control} render={({ field }) => ( <div className="space-y-2"><Label>Physical Office Address</Label><div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input {...field} className="pl-9" placeholder="e.g. Westlands Commercial Center, 4th Floor" disabled={isApproved || isSubmitting} /></div></div> )} />
                        </div>
                    )}

                    {!isApproved && !isPending && (
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !isValid}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                            Submit Verification
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
