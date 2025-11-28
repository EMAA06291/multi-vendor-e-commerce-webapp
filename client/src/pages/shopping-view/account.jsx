import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { User, Package, MapPin } from "lucide-react";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/80 via-[#2f3fbd]/70 to-[#3785D8]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">My Account</h1>
            <p className="text-white/90 text-lg">Manage your orders and addresses</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-lg p-6 md:p-8">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#EAF2FB] dark:bg-slate-700 rounded-2xl p-1">
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Address
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-6">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address" className="mt-6">
                <Address />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
