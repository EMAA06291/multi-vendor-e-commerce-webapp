import { LogOut, UserCog, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40">
      <div className="text-xl font-bold mb-4 md:mb-0">
        <Link to="/" className="hover:text-gray-300 transition-colors">
          E-Commerce
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <Link 
          to="/" 
          className="hover:text-gray-300 transition-colors text-sm md:text-base"
        >
          Home
        </Link>
        <Link 
          to="/shop/listing" 
          className="hover:text-gray-300 transition-colors text-sm md:text-base"
        >
          Products
        </Link>
        {isAuthenticated && user?.role !== "admin" && (
          <Link 
            to="/shop/become-seller" 
            className="hover:text-gray-300 transition-colors text-sm md:text-base"
          >
            Become a seller
          </Link>
        )}
        {isAuthenticated && user && (
          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <SheetTrigger asChild>
              <button className="hover:text-gray-300 transition-colors text-sm md:text-base relative">
                Cart
                {cartItems?.items && cartItems.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.items.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={
                  cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items
                    : []
                }
              />
            </SheetContent>
          </Sheet>
        )}
        {!isAuthenticated && (
          <>
            <Link 
              to="/auth/login" 
              className="hover:text-gray-300 transition-colors text-sm md:text-base"
            >
              Login
            </Link>
            <Link 
              to="/auth/register" 
              className="hover:text-gray-300 transition-colors text-sm md:text-base"
            >
              Register
            </Link>
          </>
        )}
        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                <Avatar className="bg-gray-700 border border-gray-600 w-8 h-8">
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm md:text-base hidden sm:inline">{user?.userName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="w-56">
              <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              {user?.role === "admin" && (
                <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

export default ShoppingHeader;
