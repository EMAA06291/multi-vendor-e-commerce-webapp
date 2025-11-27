import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, TrendingUp, Sparkles } from "lucide-react";
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

  const GradientShell = ({ title, description, ctaText, ctaAction }) => (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#1E0F75] via-[#2b3ca0] to-[#3785D8] text-white p-10 rounded-[32px] shadow-2xl">
      <div className="text-center max-w-2xl space-y-6">
        <p className="uppercase tracking-[0.3em] text-sm text-white/70">
          Vendor Experience
        </p>
        <h2 className="text-4xl font-bold leading-tight">{title}</h2>
        <p className="text-lg text-white/80">{description}</p>
        <Button onClick={ctaAction} className="bg-white text-[#1E0F75] hover:bg-white/90">
          {ctaText}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <GradientShell
        title="Preparing your artisan workspace"
        description="We are pulling your store insights. Thanks for your patience."
        ctaText="Back to marketplace"
        ctaAction={() => navigate("/shop/home")}
      />
    );
  }

  if (!sellerInfo) {
    return (
      <GradientShell
        title="You haven't opened your storefront yet"
        description="Bring your creations to the platform and join hundreds of local entrepreneurs."
        ctaText="Become a Seller"
        ctaAction={() => navigate("/shop/become-seller")}
      />
    );
  }

  if (sellerInfo.status !== "approved") {
    const statusCopy =
      sellerInfo.status === "pending"
        ? "Your application is under review. Our team typically responds within 48 hours."
        : sellerInfo.status === "rejected"
        ? "Your application needs adjustments. Contact support to revisit criteria."
        : "Your account is currently paused. Reach out to re-activate your storefront.";

    return (
      <GradientShell
        title={
          sellerInfo.status === "pending"
            ? "Application under review"
              : sellerInfo.status === "rejected"
            ? "Application requires attention"
            : "Account temporarily suspended"
        }
        description={statusCopy}
        ctaText="Visit support hub"
        ctaAction={() => navigate("/shop/home")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-[#1E0F75] via-[#2c3ca0] to-[#3785D8] text-white p-8 shadow-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <p className="uppercase tracking-[0.3em] text-xs text-white/70">
              Vendor Control Center
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold">
              Welcome back, {sellerInfo.storeName}
            </h1>
            <p className="text-white/80">
              Monitor your marketplace footprint, refresh listings, and stay in
              sync with our artisan-inspired theme.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-white text-[#1E0F75] hover:bg-white/90"
                onClick={() => navigate("/vendor/products")}
              >
                Manage Products
              </Button>
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => navigate(`/shop/vendor/${sellerInfo._id}`)}
              >
                View Live Store
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase text-white/70">Products</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase text-white/70">Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase text-white/70">Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue}</p>
            </div>
          </div>
      </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Products
            </CardTitle>
            <Package className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-[#1E0F75]">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-muted-foreground">
              Listings live on marketplace
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md bg-gradient-to-br from-[#fff2f7] to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-500">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-rose-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-rose-600">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-muted-foreground">
              Orders placed in your shop
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md bg-gradient-to-br from-[#eef5ff] to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sky-600">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-sky-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-sky-700">
              ${stats.totalRevenue}
            </p>
            <p className="text-xs text-muted-foreground">
              Earnings this season
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-[28px] border-0 shadow-lg max-w-md">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-semibold">
              Store Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Store Name
              </p>
              <p className="text-lg font-medium">{sellerInfo.storeName}</p>
            </div>
              <div>
              <p className="text-xs uppercase text-muted-foreground">
                Category
              </p>
              <p className="text-lg font-medium">
                {sellerInfo.storeCategory || "Not specified"}
                </p>
              </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Status
                </p>
                <p className="text-lg font-medium capitalize">
                  {sellerInfo.status}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-4 py-1 rounded-full">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

export default VendorDashboard;


