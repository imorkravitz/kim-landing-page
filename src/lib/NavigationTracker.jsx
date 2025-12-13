import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function NavigationTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // כאן הייתה קריאה לשרת (base44) שמחקנו.
    // במקום זה, נשאיר רק לוג מקומי לפיתוח.
    console.log(`Navigation: User visited ${location.pathname}`);
    
    // אם בעתיד תרצה להוסיף Google Analytics, זה המקום לעשות את זה
  }, [location, user]);

  return null;
}