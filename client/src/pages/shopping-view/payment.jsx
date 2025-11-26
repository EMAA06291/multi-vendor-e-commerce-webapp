import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FaPaypal, FaMoneyBillAlt } from "react-icons/fa";

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
    <div className="flex flex-col">
      <div className="relative h-[250px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                  <UserCartItemsContent key={item.productId} cartItem={item} />
                ))
              : null}
          </div>

          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <p className="font-bold text-lg mb-3">Total: ${totalCartAmount}</p>

            <h4 className="font-medium mb-2">Select Payment Method:</h4>
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <FaPaypal className="text-blue-600 text-xl" />
                <span>PayPal</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <FaMoneyBillAlt className="text-green-600 text-xl" />
                <span>Cash on Delivery</span>
              </div>
            </div>

            <Button
              onClick={handleInitiatePayment}
              className="w-full mt-4"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? `Processing ${paymentMethod === "paypal" ? "PayPal" : "Payment"}...`
                : `Checkout with ${paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;


