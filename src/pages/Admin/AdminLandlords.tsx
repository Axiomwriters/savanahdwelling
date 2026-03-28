import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Building2, ShieldCheck, Shield } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";

export default function AdminLandlords() {
  const [landlords, setLandlords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "landlord")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLandlords(data || []);
    } catch (error) {
      console.error("Error fetching landlords:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLandlords = landlords.filter(
    (landlord) =>
      landlord.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Landlords Management</h1>
          <p className="text-muted-foreground mt-1">Manage all registered property landlords</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredLandlords.length} landlords
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search landlords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Landlord</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Loading landlords...
                  </TableCell>
                </TableRow>
              ) : filteredLandlords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No landlords found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLandlords.map((landlord) => (
                  <TableRow key={landlord.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={landlord.avatar_url || ""} />
                          <AvatarFallback>
                            {landlord.full_name?.charAt(0) || landlord.email?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{landlord.full_name || "Unnamed Landlord"}</p>
                          <p className="text-xs text-muted-foreground">Landlord</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {landlord.email}
                    </TableCell>
                    <TableCell>
                      {landlord.verification_status === "verified" ? (
                        <Badge className="bg-green-500">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : landlord.verification_status === "pending" ? (
                        <Badge className="bg-yellow-500">
                          <Shield className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Verified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {landlord.created_at ? new Date(landlord.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
