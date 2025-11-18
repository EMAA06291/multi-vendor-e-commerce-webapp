import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import VendorOrderDetailsView from "@/components/vendor-view/order-details";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

function VendorOrders() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSellerInfo();
    }
  }, [user]);

  const fetchSellerInfo = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.SELLER + `/${user.id}`
      );
      if (response.data.success) {
        const seller = response.data.data;
        setSellerInfo(seller);
        if (seller.status === "approved" && seller._id) {
          fetchOrders(seller._id);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      setLoading(false);
    }
  };

  const fetchOrders = async (sellerId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.VENDOR.ORDERS.GET(sellerId)
      );
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrderDetails = async (orderId) => {
    if (!sellerInfo?._id) return;

    try {
      const response = await apiClient.get(
        API_ENDPOINTS.VENDOR.ORDERS.DETAILS(sellerInfo._id, orderId)
      );
      if (response.data.success) {
        setOrderDetails(response.data.data);
        setOpenDetailsDialog(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  const handleOrderUpdated = () => {
    if (sellerInfo?._id) {
      fetchOrders(sellerInfo._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Vendor Account Found</h2>
          <Button onClick={() => navigate("/shop/become-seller")}>
            Become a Seller
          </Button>
        </div>
      </div>
    );
  }

  if (sellerInfo.status !== "approved") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {sellerInfo.status === "pending"
              ? "Application Pending"
              : sellerInfo.status === "rejected"
              ? "Application Rejected"
              : "Account Suspended"}
          </h2>
          <p className="text-muted-foreground mb-6">
            Your vendor account must be approved to view orders.
          </p>
          <Button onClick={() => navigate("/shop/home")}>
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
        <p className="text-muted-foreground">
          Track and manage orders for your products
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">
                      {order._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{order.totalItems || 0} items</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          order.orderStatus === "confirmed" ||
                          order.orderStatus === "delivered"
                            ? "bg-green-500"
                            : order.orderStatus === "rejected"
                            ? "bg-red-600"
                            : order.orderStatus === "inShipping"
                            ? "bg-blue-500"
                            : order.orderStatus === "inProcess"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.orderStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.vendorTotal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={(open) => {
                          setOpenDetailsDialog(open);
                          if (!open) setOrderDetails(null);
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(order._id)}
                        >
                          View Details
                        </Button>
                        {orderDetails && (
                          <VendorOrderDetailsView
                            orderDetails={orderDetails}
                            sellerId={sellerInfo._id}
                            onOrderUpdated={handleOrderUpdated}
                          />
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VendorOrders;

