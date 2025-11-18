import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import headerpic1 from "../../assets/header1.png";
import headerpic2 from "../../assets/header3 (2).png";
import headerpic3 from "../../assets/header3 (1).png";
import accessories from "../../assets/accessories.jpg";
import catering from "../../assets/catering.jpg";
import Healthy from "../../assets/Healthy.jpg";
import tailor from "../../assets/tailor.jpg";
import pizza from "../../assets/pizza.jpg";
import food from "../../assets/Healthybreakfast.jpg";

import food2 from "../../assets/food.jpg";
import cloth1 from "../../assets/cloth (1).jpg";

import {
  Search,
  MapPin,
  Star,
  Clock,
  Shield,
  Users,
  Store,
  ChefHat,
  Scissors,
  Palette,
  Home,
  Utensils,
  Sparkles,
  Award,
  Navigation,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation as SwiperNavigation,
  Pagination,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const categoriesWithIcon = [
  {
    id: "tailors",
    label: "Tailors",
    img: tailor,
    color: "text-primary-500",
  },
  {
    id: "food",
    label: "Home Cooked Food",
    img: pizza,
    color: "text-accent-500",
  },
  {
    id: "handmade",
    label: "Handmade health products",
    img: Healthy,
    color: "text-secondary-500",
  },
  {
    id: "accessories",
    label: "Handmade accessories",
    img: accessories,
    color: "text-tertiary-500",
  },
  {
    id: "catering",
    label: "Catering",
    img: catering,
    color: "text-accent-600",
  },
];
const featuredVendors = [
  {
    id: 1,
    name: "Sarah's Custom Tailoring",
    category: "Tailors",
    rating: 4.9,
    reviews: 127,
    distance: "0.8 km",
    image: tailor,
    specialties: ["Wedding Dresses", "Men's Suits", "Alterations"],
    deliveryTime: "3-5 days",
    isVerified: true,
    description: "Professional tailoring services with 15+ years experience",
    priceRange: "$50 - $500",
    location: "Downtown District",
  },
  {
    id: 2,
    name: "Mama's Kitchen",
    category: "Home Cooked Food",
    rating: 4.8,
    reviews: 89,
    distance: "1.2 km",
    image: food,
    specialties: ["Traditional Dishes", "Healthy Meals", "Catering"],
    deliveryTime: "30-45 min",
    isVerified: true,
    description: "Authentic home-cooked meals made with love",
    priceRange: "$8 - $25",
    location: "Residential Area",
  },
  {
    id: 3,
    name: "Artisan Crafts",
    category: "Handmade Products",
    rating: 4.7,
    reviews: 156,
    distance: "2.1 km",
    image: Healthy,
    specialties: ["Pottery", "Jewelry", "Home Decor"],
    deliveryTime: "1-2 days",
    isVerified: true,
    description: "Unique handmade items crafted by local artists",
    priceRange: "$15 - $200",
    location: "Arts Quarter",
  },

  {
    id: 5,
    name: "Chef Maria's Catering",
    category: "Catering",
    rating: 4.9,
    reviews: 203,
    distance: "0.5 km",
    image: catering,
    specialties: ["Event Catering", "Corporate Meals", "Wedding Food"],
    deliveryTime: "1-2 hours",
    isVerified: true,
    description: "Premium catering services for all occasions",
    priceRange: "$25 - $100",
    location: "Business District",
  },

];

const specialOffers = [
  {
    id: 1,
    title: "New Tailor Discount",
    description: "Get 20% off on your first custom order from any local tailor",
    discount: "20% OFF",
    image: tailor,
    validUntil: "2025-11-10",
    category: "Tailors",
    code: "TAILOR20",
  },
  {
    id: 2,
    title: "Home Cooked Special",
    description:
      "Free delivery on orders above $25 from home-cooked food vendors",
    discount: "FREE DELIVERY",
    image: food2,
    validUntil: "2025-11-15",
    category: "Food",
    code: "FREEDEL25",
  },
  {
    id: 3,
    title: "Handmade Weekend",
    description: "15% off all handmade products this weekend only",
    discount: "15% OFF",
    image: Healthy,
    validUntil: "2025-11-20",
    category: "Handmade",
    code: "HANDMADE15",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    location: "Downtown",
    rating: 5,
    text: "Sarah's tailoring is absolutely amazing! She made my wedding dress and it was perfect. The attention to detail and quality is outstanding.",
    avatar: "/api/placeholder/60/60",
    vendor: "Sarah's Custom Tailoring",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Residential Area",
    rating: 5,
    text: "Mama's Kitchen has become our go-to for family dinners. The food tastes just like home and the portions are generous.",
    avatar: "/api/placeholder/60/60",
    vendor: "Mama's Kitchen",
  },
  {
    id: 3,
    name: "Sarah Williams",
    location: "Arts Quarter",
    rating: 5,
    text: "I love the unique pottery pieces from Artisan Crafts. Each piece tells a story and adds character to my home.",
    avatar: "/api/placeholder/60/60",
    vendor: "Artisan Crafts",
  },
  {
    id: 4,
    name: "David Rodriguez",
    location: "Garden District",
    rating: 5,
    text: "Green Thumb transformed my backyard into a beautiful garden. Their expertise and passion really shows in their work.",
    avatar: "/api/placeholder/60/60",
    vendor: "Green Thumb Gardening",
  },
];


const blogPosts = [
  {
    id: 1,
    title: "Supporting Local Artisans: Why It Matters",
    excerpt:
      "Discover the impact of supporting local businesses and how it strengthens our community.",
    image: accessories,
    author: "LocalCraft Team",
    date: "2025-10-10",
    readTime: "5 min read",
    category: "Community",
  },
  {
    id: 2,
    title: "The Art of Custom Tailoring: A Complete Guide",
    excerpt:
      "Everything you need to know about getting custom clothing made by local tailors.",
    image: cloth1,
    author: "Sarah's Custom Tailoring",
    date: "2025-10-12",
    readTime: "8 min read",
    category: "Fashion",
  },
  {
    id: 3,
    title: "Home-Cooked Meals: The Secret to Healthy Living",
    excerpt:
      "Why choosing home-cooked meals over fast food can transform your health and lifestyle.",
    image: food,
    author: "Mama's Kitchen",
    date: "2025-10-15",
    readTime: "6 min read",
    category: "Health",
  },
];
const demoProducts = [
  {
    id: 1,
    title: "Custom Tailor Jacket",
    price: "$80",
    rating: 4.8,
    image: tailor,
  },
  {
    id: 2,
    title: "Homemade Pizza",
    price: "$12",
    rating: 4.9,
    image: pizza,
  },
  {
    id: 3,
    title: "Handmade Soap Set",
    price: "$25",
    rating: 4.7,
    image: Healthy,
  },
  {
    id: 4,
    title: "Elegant Accessories",
    price: "$18",
    rating: 4.6,
    image: accessories,
  },
  {
    id: 5,
    title: "Wedding Catering",
    price: "$150",
    rating: 4.9,
    image: catering,
  },
  {
    id: 6,
    title: "Healthy Breakfast Box",
    price: "$20",
    rating: 4.8,
    image: food2,
  },
];
// Statistics data
const platformStats = [
  { number: "500+", label: "Local Vendors", icon: Store },
  { number: "10K+", label: "Happy Customers", icon: Users },
  { number: "4.9", label: "Average Rating", icon: Star },
  { number: "24/7", label: "Support", icon: Shield },
];

// Features data
const platformFeatures = [
  {
    icon: Sparkles,
    title: "Custom Orders",
    description: "Request personalized products directly from local artisans",
    color: "text-primary-500",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Full details about ingredients, materials, and processes",
    color: "text-secondary-500",
  },
  {
    icon: MapPin,
    title: "Local Focus",
    description: "Support your community and discover nearby talent",
    color: "text-accent-500",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Verified vendors with excellent ratings and reviews",
    color: "text-primary-600",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Current Location");
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoProducts = [
    {
      id: "p1",
      title: "Handmade accessories",
      price: "$45",
      rating: 4.8,
      image: accessories,
    },
    {
      id: "p2",
      title: "Custom Tailored Shirt",
      price: "$70",
      rating: 4.9,
      image: tailor,
    },
    {
      id: "p3",
      title: "catring ",
      price: "$12",
      rating: 4.7,
      image: catering,
    },
    {
      id: "p4",
      title: "dried fruits",
      price: "$28",
      rating: 4.6,
      image: cloth1
    },
    {
      id: "p5",
      title: "delisious bakery",
      price: "$9",
      rating: 4.5,
      image: food2,
    },
    {
      id: "p6",
      title: "healthy food",
      price: "$55",
      rating: 4.8,
      image: Healthy,
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
    AOS.refresh();
  }, []);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleCustomOrder(vendorId) {
    navigate(`/custom-order/${vendorId}`);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % specialOffers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const cardInView = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const hoverScale = { scale: 1.02, transition: { duration: 0.18 } };

  const btnTextClass = "text-white";
  const messages = [
    " Welcome to LuxMart — Where Style Meets Comfort ",
    " Exclusive Deals — Up to 50% Off This Week!",
    " Discover Premium Home Essentials at Unbeatable Prices!",
    " Shop Smart. Live Beautifully.",
  ]
  return (
    <div className="flex flex-col min-h-screen bg-bg-100 dark:bg-slate-900">
      <section className="relative min-h-[80vh] overflow-hidden">
        <Swiper
          modules={[SwiperNavigation, Autoplay, EffectFade]}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={800}
          grabCursor={true}
          className="h-full"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative bg-gradient-hero min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Discover Local
                      <span className="block text-accent-500">
                        Artisans & Creators
                      </span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Connect with talented local businesses — from custom
                      tailors to home-cooked meals. Support small entrepreneurs
                      and get unique, personalized products.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className={`bg-gradient-primary hover:opacity-90 px-6 py-3 rounded-xl ${btnTextClass}`}
                      >
                        Explore
                      </Button>
                      <Button
                        className={`bg-white/10 border border-white/20 hover:bg-white/12 px-6 py-3 rounded-xl ${btnTextClass}`}
                      >
                        How it works
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative  w-full lg:h-[400px]  md:h-80  overflow-hidden "
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic1}
                      alt="Artisan showcase"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Custom Orders
                      <span className="block text-yellow-300">
                        Made Just for You
                      </span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Request personalized products from local artisans. Get
                      exactly what you want, made with care and attention to
                      detail by skilled craftspeople.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className={`bg-white text-primary-600 hover:bg-white/90 px-6 py-3 rounded-xl ${btnTextClass}`}
                      >
                        Start Custom Order
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative w-[70%] "
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic2}
                      alt="Custom orders"
                      className="w-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative bg-gradient-to-br from-secondary-500 to-primary-500 min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Support Local
                      <span className="block text-green-300">Communities</span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Every purchase supports local entrepreneurs and helps
                      build stronger communities. Discover the talent in your
                      neighborhood.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className={`bg-white text-secondary-600 hover:bg-white/90 px-6 py-3 rounded-xl ${btnTextClass}`}
                      >
                        Explore Vendors
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative w-[60%]"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic3}
                      alt="Support local"
                      className="w-full  object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
  <div className="relative overflow-hidden h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 flex items-center justify-center text-white text-sm sm:text-base font-medium">
      <motion.div
        className="flex gap-5 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-6">
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
      <section className="py-5 bg-white dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted dark:text-slate-300 max-w-2xl mx-auto">
              Find exactly what you're looking for from our diverse range of
              local businesses
            </p>
          </div>

       

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
  {categoriesWithIcon.map((category, idx) => (
    <motion.div
      key={category.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardInView}
      whileHover={hoverScale}
      className="group"
      data-aos="zoom-in"
      data-aos-delay={idx * 60}
    >
      <Card
        onClick={() => handleNavigateToListingPage(category, "category")}
        className="cursor-pointer hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-2 border-0 bg-card-bg dark:bg-slate-800"
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 overflow-hidden rounded-full border-0 bg-gradient-to-br from-primary-100 to-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <img
              src={category.img}
              alt={category.label}
              className="w-full rounded-full object-contain"
            />
          </div>
          <h3 className="font-semibold text-text-900 dark:text-slate-100 mb-2">
            {category.label}
          </h3>
          <p className="text-sm text-muted dark:text-slate-300">
            Explore local options
          </p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
        </div>
      </section>

      <section
        className="py-5 bg-bg-200 dark:bg-slate-800/60"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Special Offers
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Don't miss out on these amazing deals
            </p>
          </div>

          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={700}
            grabCursor={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
          {
  specialOffers.map((offer) => (
    <SwiperSlide key={offer.id}>
      <Card className="relative border-0 shadow-custom-2 h-full rounded-2xl overflow-hidden group">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        <CardContent className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <Badge className="bg-white/20 text-white mb-3 w-fit">
            {offer.discount}
          </Badge>
          <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
          <p className="text-white/90 mb-4">{offer.description}</p>
          <div className="flex items-center justify-between">
            <Button className="bg-white text-primary-600 font-semibold hover:bg-white/90">
              Claim Offer
            </Button>
            <div className="text-sm text-white/70">Code: {offer.code}</div>
          </div>
        </CardContent>
      </Card>
    </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className=" bg-white dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Featured Local Vendors
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Discover top-rated local businesses near you
            </p>
          </div>

          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
           {featuredVendors.map((vendor) => (
  <SwiperSlide key={vendor.id}>
    <Card className="group hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-slate-900 h-full rounded-2xl overflow-hidden">
            <div className="relative w-full h-48">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        {vendor.isVerified && (
          <Badge className="absolute top-4 right-4 bg-success-500 text-white flex items-center gap-1 shadow-md">
            <Shield className="w-3 h-3" />
            Verified
          </Badge>
        )}
      </div>

      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              {vendor.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {vendor.category}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {vendor.rating}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {vendor.reviews} reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Navigation className="w-4 h-4" />
            {vendor.distance}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {vendor.deliveryTime}
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Specialties:
          </p>
          <div className="flex flex-wrap gap-2">
            {vendor.specialties.map((specialty, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-slate-800 dark:text-gray-300"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            className={`flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90`}
            onClick={() => navigate(`/vendor/${vendor.id}`)}
          >
            View Store
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCustomOrder(vendor.id)}
            className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:text-black"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </SwiperSlide>
))}

          </Swiper>
        </div>
      </section>

     <section className="py-5 bg-white dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Simple steps to connect with local artisans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center" data-aos="zoom-in">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="font-bold text-xl text-text-900 dark:text-slate-100 mb-3">
                Browse & Discover
              </h3>
              <p className="text-muted dark:text-slate-300">
                Explore local vendors in your area. Find tailors, home cooks,
                artisans, and service providers near you.
              </p>
            </div>

            <div className="text-center" data-aos="zoom-in" data-aos-delay="80">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="font-bold text-xl text-text-900 dark:text-slate-100 mb-3">
                Connect & Order
              </h3>
              <p className="text-muted dark:text-slate-300">
                Browse products, request custom orders, or book services
                directly with verified local businesses.
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="160"
            >
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="font-bold text-xl text-text-900 dark:text-slate-100 mb-3">
                Enjoy & Support
              </h3>
              <p className="text-muted dark:text-slate-300">
                Receive your personalized products and support local
                entrepreneurs in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 bg-bg-200 dark:bg-slate-800/60"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Empowering local businesses and connecting communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-text-900 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="py-16 bg-gray-50 dark:bg-slate-900">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
      Featured Products
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {demoProducts.map((p, idx) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-white dark:bg-slate-800 dark:text-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col items-center text-center space-y-3">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-bold">
                  {p.price}
                </p>

                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(p.rating) ? "fill-yellow-500" : "opacity-30"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">
                    {p.rating}
                  </span>
                </div>

                <Button
                  className="w-full mt-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 transition-all duration-300"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <section className="py-5 bg-white dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Real stories from our community
            </p>
          </div>

          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <Card className="border-0 bg-card-bg dark:bg-slate-800 shadow-custom-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-900 dark:text-slate-100">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted dark:text-slate-300">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-warning-500 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-muted dark:text-slate-300 mb-4 italic flex-grow">
                      "{testimonial.text}"
                    </p>

                    <div className="text-sm text-primary-500 font-medium mt-auto dark:text-primary-300">
                      - {testimonial.vendor}
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section
        className="py-5 bg-bg-200 dark:bg-slate-800/60"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-lg text-muted dark:text-slate-300">
              Tips, stories, and insights from our community
            </p>
          </div>

          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
          {blogPosts.map((post) => (
    <SwiperSlide key={post.id}>
      <Card className="group hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-slate-900 overflow-hidden h-full rounded-2xl">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

          <Badge className="absolute top-4 left-4 bg-primary-500 text-white shadow-md">
            {post.category}
          </Badge>
        </div>

        <CardContent className="p-6 flex flex-col h-full">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-12">
            <Button
              className={`bg-gradient-primary hover:opacity-90 text-white px-8 py-3 rounded-xl ${btnTextClass}`}
            >
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-hero text-white" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-white/90">
              Get the latest updates on new vendors, special offers, and
              community stories
            </p>

            <div className="max-w-md mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast?.({ title: "Thanks — you've been subscribed (demo)" });
                }}
              >
                <div className="flex gap-4">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="flex-1 bg-white/12 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                  />
                  <Button
                    type="submit"
                    className={`bg-white text-primary-500 hover:bg-white/90 px-8 ${btnTextClass}`}
                  >
                    Subscribe
                  </Button>
                </div>
         
              </form>

              <p className="text-sm text-white/70 mt-4">
                Join 5,000+ subscribers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>


        

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
