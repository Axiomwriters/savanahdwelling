import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, User, Home, Eye, Check, X, Phone, Mail } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { toast } from "sonner";

type ViewingStatus = "all" | "scheduled" | "completed" | "cancelled" | "no_show";

interface Viewing {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  property_title: string;
  viewing_date: string;
  viewing_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function AdminViewings() {
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ViewingStatus>("all");
  const [selectedViewing, setSelectedViewing] = useState<Viewing | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchViewings();
  }, [statusFilter]);

  const fetchViewings = async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin
        .from("viewings")
        .select("*")
        .order("viewing_date", { ascending: true });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setViewings(data || []);
    } catch (error) {
      console.error("Error fetching viewings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabaseAdmin
        .from("viewings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Viewing marked as ${status}`);
      fetchViewings();
    } catch (error) {
      console.error("Error updating viewing:", error);
      toast.error("Failed to update viewing");
    }
  };

  const filteredViewings = viewings.filter(
    (viewing) =>
      viewing.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      viewing.property_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-KE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Viewings Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all property viewings</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredViewings.length} viewings
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ViewingStatus)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading viewings...
                  </TableCell>
                </TableRow>
              ) : filteredViewings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No viewings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredViewings.map((viewing) => (
                  <TableRow key={viewing.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{viewing.client_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {viewing.client_email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate">{viewing.property_title || "Unknown Property"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(viewing.viewing_date)}
                        </p>
                        <p className="text-muted-foreground text-xs">{viewing.viewing_time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          viewing.status === "scheduled"
                            ? "bg-blue-500"
                            : viewing.status === "completed"
                            ? "bg-green-500"
                            : viewing.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }
                      >
                        {viewing.status?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedViewing(viewing);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {viewing.status === "scheduled" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleUpdateStatus(viewing.id, "completed")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleUpdateStatus(viewing.id, "cancelled")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Viewing Details</DialogTitle>
          </DialogHeader>
          {selectedViewing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedViewing.client_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedViewing.client_email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Property</p>
                  <p className="font-medium">{selectedViewing.property_title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedViewing.viewing_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedViewing.viewing_time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedViewing.client_phone || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedViewing.status === "scheduled"
                        ? "bg-blue-500"
                        : selectedViewing.status === "completed"
                        ? "bg-green-500"
                        : selectedViewing.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }
                  >
                    {selectedViewing.status?.replace("_", " ")}
                  </Badge>
                </div>
                {selectedViewing.notes && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Notes</p>
                    <p className="font-medium">{selectedViewing.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
