import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { User, Package, MapPin, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { checkAuth } from "@/store/auth-slice";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user?.profilePic]);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("my_file", file);

      const uploadResponse = await apiClient.post(
        API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PICTURE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        const imageUrl = uploadResponse.data.result.url;

        // Update user profile picture
        const updateResponse = await apiClient.put(
          API_ENDPOINTS.AUTH.UPDATE_PROFILE_PICTURE(user.id),
          { profilePicUrl: imageUrl }
        );

        if (updateResponse.data.success) {
          setProfilePic(imageUrl);
          
          // Refresh user data from server to update Redux store
          dispatch(checkAuth());

          toast({
            title: "Success",
            description: "Profile picture updated successfully",
          });
        } else {
          throw new Error("Failed to update profile picture");
        }
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
            <div
              className="relative w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30 cursor-pointer hover:bg-white/30 transition-all group overflow-hidden"
              onClick={handleProfilePicClick}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
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
