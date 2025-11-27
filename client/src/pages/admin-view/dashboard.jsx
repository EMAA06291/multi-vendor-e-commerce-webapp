import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sparkles, Image as ImageIcon } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const totalFeatures = featureImageList?.length || 0;

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white p-8 shadow-xl">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.3em] text-xs text-white/70">
              Marketplace Spotlight
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Curate the home experience for every shopper
            </h1>
            <p className="text-white/80">
              Upload featured imagery, craft editorial moments, and keep the
              shopping journey aligned with our artisan-first vision.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/admin/write-article")}
                className="bg-white text-[#1E0F75] hover:bg-white/90"
              >
                Write an Article
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/shop/home")}
                className="border-white/40 text-white hover:bg-white/10"
              >
                View Live Marketplace
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/10 backdrop-blur p-5">
              <Sparkles className="w-8 h-8 text-amber-300 mb-3" />
              <p className="text-sm uppercase text-white/70">Live Features</p>
              <p className="text-3xl font-bold">{totalFeatures}</p>
            </div>
            <div className="rounded-3xl bg-white/10 backdrop-blur p-5">
              <ImageIcon className="w-8 h-8 text-sky-300 mb-3" />
              <p className="text-sm uppercase text-white/70">Uploads Ready</p>
              <p className="text-3xl font-bold">
                {uploadedImageUrl ? "1" : "0"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Feature Uploads</h2>
              <p className="text-sm text-muted-foreground">
                Use high-impact imagery (1200x600) to elevate the hero carousel.
              </p>
            </div>
          </div>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90"
            disabled={!uploadedImageUrl}
          >
            Publish Feature Image
          </Button>
        </div>

        <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#fff6fb] via-white to-[#f3f4ff] dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-[#1E0F75] dark:text-white">
            Editorial Tips
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              • Highlight seasonal collections or limited collaborations to keep
              shoppers engaged.
            </li>
            <li>
              • Pair each feature image with a story via the "Write Article"
              action.
            </li>
            <li>
              • Refresh at least twice a week to mirror the Become Seller
              campaign aesthetic.
            </li>
          </ul>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-800/70 p-4 backdrop-blur">
            <p className="text-sm text-[#1E0F75] dark:text-slate-200 font-medium">
              Need curated assets? Reach out to the creative studio for
              ready-made hero sets.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-2xl font-semibold">Live Feature Gallery</h3>
          <p className="text-sm text-muted-foreground">
            {totalFeatures > 0
              ? "Drag-and-drop ordering arriving soon."
              : "Start uploading to populate the hero carousel."}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((featureImgItem) => (
              <div
                key={featureImgItem._id}
                className="group relative rounded-3xl overflow-hidden shadow-lg"
              >
                <img
                  src={featureImgItem.image}
                  className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm uppercase tracking-widest text-white/70">
                    Spotlight Visual
                  </p>
                  <p className="text-lg font-semibold">Ready for homepage</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-muted-foreground">
              No feature imagery yet. Upload your first spotlight above to
              mirror the Become Seller theme across the site.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
