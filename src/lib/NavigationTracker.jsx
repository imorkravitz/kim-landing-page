import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function NavigationTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname });
    }
  }, [location, user]);

  return null;
}