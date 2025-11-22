import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");

<<<<<<< Updated upstream
  // Only validate authentication for admin pages
  if (isAdminPage) {
    // If trying to access admin pages without authentication
=======
  // 🧩 أضف السطرين دول في الأول:
  const disableAuth = true; // ✅ عطّل التحقق مؤقتًا أثناء الاختبار
  if (disableAuth) return <>{children}</>;

  console.log(location.pathname, isAuthenticated);

  if (location.pathname === "/") {
>>>>>>> Stashed changes
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    // If authenticated but not an admin, redirect to unauth page
    if (isAuthenticated && user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
  }

  // If authenticated user tries to access auth pages (login/register), redirect them
  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/register") ||
      location.pathname === "/auth")
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Allow access to all other pages (shopping pages are public)
  return <>{children}</>;
}

export default CheckAuth;
