import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, FileText, Check, X, Eye, Shield, Clock, User } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerificationRequest {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  verification_documents: any;
  verification_status: string | null;
  submitted_at: string | null;
}

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ verification_status: "verified" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Verification approved successfully");
      fetchVerifications();
    } catch (error) {
      console.error("Error approving verification:", error);
      toast.error("Failed to approve verification");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ verification_status: "rejected" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Verification rejected");
      fetchVerifications();
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("Failed to reject verification");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredVerifications = verifications.filter(
    (v) =>
      v.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocumentUrl = (docPath: string) => {
    const { data } = supabase.storage.from("verification-docs").getPublicUrl(docPath);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Verification Requests</h1>
          <p className="text-muted-foreground mt-1">Review and approve user verification documents</p>
        </div>
        <Badge variant="outline" className="text-sm gap-1">
          <Clock className="w-3 h-3" />
          {filteredVerifications.length} pending
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading verifications...
                  </TableCell>
                </TableRow>
              ) : filteredVerifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="w-8 h-8 text-green-500" />
                      <p>All verifications have been processed!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={verification.avatar_url || ""} />
                          <AvatarFallback>
                            {verification.full_name?.charAt(0) || verification.email?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{verification.full_name || "Unnamed User"}</p>
                          <p className="text-xs text-muted-foreground">{verification.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {verification.role || "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {verification.submitted_at
                        ? new Date(verification.submitted_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(verification.id)}
                          disabled={processingId === verification.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(verification.id)}
                          disabled={processingId === verification.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedVerification.avatar_url || ""} />
                  <AvatarFallback className="text-lg">
                    {selectedVerification.full_name?.charAt(0) || selectedVerification.email?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{selectedVerification.full_name || "Unnamed User"}</p>
                  <p className="text-sm text-muted-foreground">{selectedVerification.email}</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {selectedVerification.role || "User"}
                  </Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Submitted Documents
                </h4>
                {selectedVerification.verification_documents ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedVerification.verification_documents).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase">{key.replace(/_/g, " ")}</p>
                        <div className="border rounded-lg p-2 bg-muted/30">
                          {typeof value === "string" && value.match(/\.(jpg|jpeg|png|pdf)$/i) ? (
                            <a
                              href={getDocumentUrl(value)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Document
                            </a>
                          ) : (
                            <p className="text-sm">{JSON.stringify(value)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No documents submitted</p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailOpen(false);
                    handleReject(selectedVerification.id);
                  }}
                  disabled={processingId === selectedVerification.id}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setDetailOpen(false);
                    handleApprove(selectedVerification.id);
                  }}
                  disabled={processingId === selectedVerification.id}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
