import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";

function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSellerInfo();
    }
  }, [user]);

  const fetchSellerInfo = async () => {
    try {
      setLoading(true);
      // Get seller application by userId
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.SELLER + `/${user.id}`
      );
      if (response.data.success) {
        const seller = response.data.data;
        setSellerInfo(seller);
        
        // Fetch vendor products to get stats
        if (seller._id) {
          const productsRes = await apiClient.get(
            API_ENDPOINTS.VENDOR.PRODUCTS.GET(seller._id)
          );
          if (productsRes.data.success) {
            setStats({
              totalProducts: productsRes.data.data.length,
              totalOrders: 0, // Can be implemented later
              totalRevenue: 0, // Can be implemented later
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      if (error.response?.status === 404) {
        // User doesn't have a seller account
        navigate("/shop/become-seller");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Vendor Account Found</h2>
          <p className="text-muted-foreground mb-6">
            You need to create a vendor account first
          </p>
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
            {sellerInfo.status === "pending"
              ? "Your vendor application is under review. We'll notify you once it's approved."
              : sellerInfo.status === "rejected"
              ? "Your vendor application has been rejected. Please contact support for more information."
              : "Your vendor account has been suspended. Please contact support for more information."}
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
        <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {sellerInfo.storeName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in your store
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => navigate("/vendor/products")}
              className="w-full"
            >
              Manage Products
            </Button>
            <Button
              onClick={() => navigate(`/shop/vendor/${sellerInfo._id}`)}
              variant="outline"
              className="w-full"
            >
              View Store
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Store Name:</span>
                <p className="text-sm text-muted-foreground">
                  {sellerInfo.storeName}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Category:</span>
                <p className="text-sm text-muted-foreground">
                  {sellerInfo.storeCategory}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Status:</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {sellerInfo.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VendorDashboard;


