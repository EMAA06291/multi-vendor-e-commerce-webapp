import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  return (
    <div className="container mx-auto p-5 max-w-2xl">
      <Card className="p-10">
        <CardHeader className="p-0">
          <CardTitle className="text-4xl mb-4 text-green-600">
            Order Completed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderDetails ? (
            <>
              <div className="mb-4 space-y-2">
                <p>
                  <strong>Order ID:</strong> {orderDetails?._id || "N/A"}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${orderDetails?.totalAmount?.toFixed(2) || "0.00"}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {orderDetails?.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : orderDetails?.paymentMethod === "paypal"
                    ? "PayPal"
                    : orderDetails?.paymentMethod || "N/A"}
                </p>
                <p>
                  <strong>Order Status:</strong> {orderDetails?.orderStatus || "pending"}
                </p>
              </div>
              {orderDetails?.addressInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h3 className="font-bold mb-2">Shipping Address</h3>
                  <p>
                    {orderDetails.addressInfo.address}, {orderDetails.addressInfo.city}
                  </p>
                  <p>{orderDetails.addressInfo.pincode}</p>
                  <p>Phone: {orderDetails.addressInfo.phone}</p>
                  {orderDetails.addressInfo.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      Notes: {orderDetails.addressInfo.notes}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">Payment completed successfully!</p>
          )}
          <Button className="mt-5" onClick={() => navigate("/shop/account")}>
            View Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
