import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle, XCircle, Ban, Trash2, Eye } from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useNavigate } from "react-router-dom";

function AdminVendors() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "pending"

  useEffect(() => {
    fetchVendors();
    fetchPendingVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.VENDORS.GET);
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVendors = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.VENDORS.PENDING);
      if (response.data.success) {
        setPendingVendors(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.APPROVE(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor approved successfully",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.REJECT(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor application rejected",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.SUSPEND(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor suspended successfully",
        });
        fetchVendors();
      }
    } catch (error) {
      console.error("Error suspending vendor:", error);
      toast({
        title: "Error",
        description: "Failed to suspend vendor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm("Are you sure you want to delete this vendor? This will also delete all their products.")) {
      return;
    }

    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.ADMIN.VENDORS.DELETE(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
      suspended: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const displayVendors = activeTab === "pending" ? pendingVendors : vendors;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage vendor applications and existing vendors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        <Button
          variant={activeTab === "all" ? "default" : "ghost"}
          onClick={() => setActiveTab("all")}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          All Vendors ({vendors.length})
        </Button>
        <Button
          variant={activeTab === "pending" ? "default" : "ghost"}
          onClick={() => setActiveTab("pending")}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Pending Applications ({pendingVendors.length})
        </Button>
      </div>

      {/* Vendors Table */}
      {displayVendors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {activeTab === "pending"
                ? "No pending vendor applications"
                : "No vendors found"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "pending" ? "Pending Applications" : "All Vendors"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayVendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium">
                      {vendor.storeName}
                    </TableCell>
                    <TableCell>
                      {vendor.userId?.email || "N/A"}
                    </TableCell>
                    <TableCell>{vendor.storeCategory}</TableCell>
                    <TableCell className="capitalize">
                      {vendor.businessType}
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/shop/vendor/${vendor._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Store
                          </DropdownMenuItem>
                          {vendor.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprove(vendor._id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleReject(vendor._id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {vendor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleSuspend(vendor._id)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {vendor.status === "suspended" && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(vendor._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(vendor._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminVendors;


