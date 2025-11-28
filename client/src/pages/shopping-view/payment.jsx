import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FaPaypal, FaMoneyBillAlt } from "react-icons/fa";
import { CreditCard, ShoppingBag, MapPin, CheckCircle2 } from "lucide-react";

function PaymentPage() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePayment() {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes || "",
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        if (paymentMethod === "paypal" && data?.payload?.approvalURL) {
          window.location.href = data.payload.approvalURL;
        } else {
          // COD order - navigate to success page
          navigate("/shop/payment-success", {
            state: { orderDetails: { ...orderData, _id: data?.payload?.orderId } },
          });
        }
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Error creating order. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src={img} 
          className="h-full w-full object-cover object-center" 
          alt="Payment background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/80 via-[#2f3fbd]/70 to-[#3785D8]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
            <p className="text-white/90 text-lg">Review your order and select payment method</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Address Selection */}
            <div className="space-y-6">
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Delivery Address</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Select or add a delivery address
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                    hideHeader={true}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {cartItems?.items?.length || 0} item(s) in your cart
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scroll">
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                      cartItems.items.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-600 dark:text-slate-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Your cart is empty</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method & Total */}
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Payment Method</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Choose how you'd like to pay
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-[#3785D8] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "paypal"
                          ? "bg-[#3785D8]"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}>
                        <FaPaypal className={`text-xl ${
                          paymentMethod === "paypal" ? "text-white" : "text-slate-600 dark:text-slate-300"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">PayPal</p>
                          {paymentMethod === "paypal" && (
                            <CheckCircle2 className="w-5 h-5 text-[#3785D8]" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Pay securely with your PayPal account
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "bg-emerald-500"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}>
                        <FaMoneyBillAlt className={`text-xl ${
                          paymentMethod === "cod" ? "text-white" : "text-slate-600 dark:text-slate-300"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</p>
                          {paymentMethod === "cod" && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-transparent bg-clip-text">
                        ${totalCartAmount.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleInitiatePayment}
                      className="w-full h-12 text-base bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-lg font-semibold"
                      disabled={isPaymentStart}
                    >
                      {isPaymentStart ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing {paymentMethod === "paypal" ? "PayPal" : "Payment"}...
                        </span>
                      ) : (
                        `Complete Order with ${paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;


