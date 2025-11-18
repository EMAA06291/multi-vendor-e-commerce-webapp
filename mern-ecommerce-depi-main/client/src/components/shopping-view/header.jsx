import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Search,
  MapPin,
  Sparkles,
  Moon,
  Sun,
  Heart,
  Store,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useTheme } from "@/contexts/ThemeContext";

// ✅ الناف بار المعدل
const shoppingViewHeaderMenuItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "products", label: "Products", path: "/shop/listing" },
  { id: "blogs", label: "Blogs", path: "/shop/blogs" },
  { id: "contact", label: "Contact Us", path: "/shop/contact" },
  { id: "become-seller", label: "Become a Seller", path: "/shop/become-seller" },
];

const ShoppingHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toggleTheme } = useTheme();

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "contact"
        ? { category: [menuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${menuItem.id}`));
    } else {
      navigate(menuItem.path);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm shadow-custom-1 bg-white/95 text-black border-gray-200 dark:bg-[#0f0f0f] dark:text-white dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-text-900">
              <span className="font-bold text-xs text-text-900">that's </span>
              SoMe
            </span>
            <span className="text-xs text-muted -mt-1 text-gray-600">
              Local Marketplace
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-400" />
              <Input
                placeholder="Search for tailors, food, handmade items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-0 transition-colors bg-bg-200 text-black focus:bg-white dark:bg-[#1a1a1a] dark:text-white dark:placeholder-gray-400 dark:focus:bg-[#222]"
              />
            </div>
          </form>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#4500a5] dark:text-[#6a00ff] dark:hover:bg-[#2e006e] dark:hover:text-white"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-full max-w-xs bg-white dark:bg-[#0f0f0f] dark:text-white"
          >
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Search</h3>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2"
                  />
                </div>
              </form>
            </div>

            <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
              {shoppingViewHeaderMenuItems.map((menuItem) => (
                <Label
                  onClick={() => handleNavigate(menuItem)}
                  className="text-sm font-medium cursor-pointer hover:text-primary-500 transition-colors relative group"
                  key={menuItem.id}
                >
                  {menuItem.label}
                  {menuItem.id === "home" && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  )}
                </Label>
              ))}
            </nav>

            <div className="flex lg:items-center lg:flex-row flex-col gap-4 mt-6">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
              >
                <Moon className="w-5 h-5 dark:hidden" />
                <Sun className="w-5 h-5 hidden dark:block" />
              </Button>

              <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button
                  onClick={() => setOpenCartSheet(true)}
                  variant="outline"
                  size="icon"
                  className="relative border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute top-[-5px] right-[2px] font-bold bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems?.items?.length || 0}
                  </span>
                </Button>

                <UserCartWrapper
                  setOpenCartSheet={setOpenCartSheet}
                  cartItems={
                    cartItems && cartItems.items && cartItems.items.length > 0
                      ? cartItems.items
                      : []
                  }
                />
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-black">
                    <AvatarFallback className="bg-black text-white font-extrabold">
                      {user?.userName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex items-center gap-4">
          <nav className="flex items-center gap-6">
            {shoppingViewHeaderMenuItems.map((menuItem) => (
              <Label
                onClick={() => handleNavigate(menuItem)}
                className="text-sm font-medium cursor-pointer hover:text-primary-500 transition-colors relative group"
                key={menuItem.id}
              >
                {menuItem.label}
                {menuItem.id === "home" && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                )}
              </Label>
            ))}
          </nav>

          {!isAuthenticated && (
            <Button
              onClick={() => navigate("/auth/register")}
              variant="outline"
              className="font-medium transition-colors border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
            >
              Register
            </Button>
          )}

          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
            >
              <Moon className="w-5 h-5 dark:hidden" />
              <Sun className="w-5 h-5 hidden dark:block" />
            </Button>

            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
              <Button
                onClick={() => setOpenCartSheet(true)}
                variant="outline"
                size="icon"
                className="relative border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-[-5px] right-[2px] font-bold bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems?.items?.length || 0}
                </span>
              </Button>

              <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={
                  cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items
                    : []
                }
              />
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-black">
                  <AvatarFallback className="bg-black text-white font-extrabold">
                    {user?.userName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-56">
                <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
