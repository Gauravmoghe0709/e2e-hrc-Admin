import { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Loginpage from "../pages/Loginpage";
import HomeManagement from "../pages/home";
import AboutUsManagement from "../pages/Aboutus";
import BlogsLayout from "../pages/BlogsLayout";
import BlogServices from "../pages/BlogServices";
import BlogManagement from "../pages/BlogManagement";
import ContactLayout from "../pages/ContactLayout";
import ContactSettings from "../pages/ContactSettings";
import ContactEnquiries from "../pages/ContactEnquiries";
import EmployerManagement from "../pages/employer";
import EmployeeManagement from "../pages/EmployeeManagement";
import BecomePartnerManagement from "../pages/becomepartner";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <Topbar setIsOpen={setIsOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="lg:ml-72 pt-16 min-h-screen bg-gray-50 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const Approute = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Loginpage />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomeManagement />} />
                <Route path="about-us" element={<AboutUsManagement />} />
                <Route path="employer" element={<EmployerManagement />} />
                <Route path="employee" element={<EmployeeManagement />} />
                <Route path="become-partner" element={<BecomePartnerManagement />} />

                {/* ── Blogs nested routes ─────────────────────────────────── */}
                <Route path="blogs" element={<BlogsLayout />}>
                    <Route index element={<Navigate to="management" replace />} />
                    <Route path="services" element={<BlogServices />} />
                    <Route path="management" element={<BlogManagement />} />
                </Route>

                {/* ── Contact nested routes ───────────────────────────────── */}
                <Route path="contact" element={<ContactLayout />}>
                    <Route index element={<Navigate to="enquiries" replace />} />
                    <Route path="settings" element={<ContactSettings />} />
                    <Route path="enquiries" element={<ContactEnquiries />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default Approute;