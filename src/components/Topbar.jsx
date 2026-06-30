import { Menu, Search, Bell, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Topbar({ setIsOpen }) {
  const location = useLocation();

  // Helper to get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("home")) return "Home Page";
    if (path.includes("about-us")) return "About Us";
    if (path.includes("contact-enquiry")) return "Contact Enquiry";
    if (path.includes("blogs")) return "Blogs";
    if (path.includes("become-partner")) return "Become a Partner";
    if (path.includes("employer")) return "Employer";
    return "Dashboard";
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white  z-40 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb / Title */}
        <div className="hidden sm:flex items-center text-sm font-medium">
          <span className="text-gray-400">Dashboard</span>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-orange-500">{getPageTitle()}</span>
        </div>
        {/* Mobile Title */}
        <div className="sm:hidden text-lg font-bold text-gray-800 tracking-tight">
          {getPageTitle()}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 lg:gap-5">

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 cursor-pointer rounded-full">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-semibold text-gray-800 leading-tight">Admin User</p>

          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=f97316&color=fff" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
