import { Home, Settings, UserRound, X, LogIn } from "lucide-react";

import { useEffect, useState } from "react";
import { Sidebar, MenuItem, Menu as SidebarMenu } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useUser } from "@/hooks";
import { toast } from "react-toastify";
import { useLogoutMutation } from "@/redux/api/apiSlice";

export const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [toggled, setToggled] = useState(false);
  const userInfo = useUser();
  console.log({ userInfo });
  const location = useLocation();
  const currentTab = location.pathname.trim();
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response.message || "Logged out successfully.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error while logging out. Please try again."
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClass = isSticky
    ? "w-full transition-all duration-300 px-4 lg:px-0 py-2 fixed top-0 left-0 z-[100]   text-white backdrop-blur-md  shadow-lg border-b border-b-neutral-600/20"
    : "border-b border-b-neutral-600/20 bg-transparent text-zinc-50 px-4 lg:px-0 py-2 flex justify-between items-center fixed top-0 left-0 w-full z-[100] text-black";

  return (
    <>
      <div className={navbarClass}>
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <img src="./logo.png" alt="logo" className="h-12" />
          </div>

          <div className="space-x-7 hidden lg:flex text-xl ">
            <Link
              to="/"
              className={`cursor-pointer hover:text-gray-300 transition-colors ${
                currentTab === "/"
                  ? "underline underline-offset-4 decoration-blue-500 decoration-2"
                  : ""
              }`}
            >
              Home
            </Link>

            <Link
              to="/docs"
              className={`cursor-pointer hover:text-gray-300 transition-colors ${
                currentTab === "/docs"
                  ? "underline underline-offset-4 decoration-blue-500 decoration-2"
                  : ""
              }`}
            >
              Docs
            </Link>

            <Link
              to="/dashboard"
              className={`cursor-pointer hover:text-gray-300 transition-colors ${
                currentTab === "/dashboard"
                  ? "underline underline-offset-4 decoration-blue-500 decoration-2"
                  : ""
              }`}
            >
              Dashboard
            </Link>

            {(userInfo.data && userInfo.data.data.role === "admin") && (
              <Link
                to="/admin"
                className={`cursor-pointer hover:text-gray-300 transition-colors ${
                  currentTab === "/admin"
                    ? "underline underline-offset-4 decoration-blue-500 decoration-2"
                    : ""
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="flex space-x-4 items-center">
            {userInfo?.data ? (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={userInfo.data.data.avatar || "avatar"}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-none"
                  />
                  <Button
                    disabled={isLoading}
                    className="text-black text-base bg-white border hover:bg-gray-200 cursor-pointer"
                    onClick={logoutHandler}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className={`font-base border-2 shadow transition-colors flex text-base cursor-pointer items-center gap-2 ${
                      isSticky
                        ? "text-black hover:bg-white/20 hover:text-black"
                        : "text-black hover:bg-white/80 hover:text-black"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[998] bg-black/40 transition-opacity duration-300 ${
          toggled
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setToggled(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full z-[999] transition-transform duration-300 ease-in-out ${
          toggled ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          toggled={toggled}
          backgroundColor="#000000"
          width="220px"
          collapsedWidth="0px"
          breakPoint="lg"
          transitionDuration={300}
        >
          <div className="flex items-center justify-between p-4 border-b border-b-gray-600/30">
            <div>
              <img src="./logowhite.png" alt="logo" className="h-9" />
            </div>
            <X
              className="w-5 h-5 cursor-pointer text-white hover:text-gray-300 transition-colors"
              onClick={() => setToggled(false)}
            />
          </div>

          <SidebarMenu className="text-base font-medium">
            <MenuItem
              icon={<Home className="w-5 h-5" />}
              component={<Link to="/" />}
              onClick={() => setToggled(false)}
              className="text-white hover:bg-orange-500 hover:text-white transition-colors"
            >
              Home
            </MenuItem>
            <MenuItem
              icon={<UserRound className="w-5 h-5" />}
              component={<Link to="/docs" />}
              onClick={() => setToggled(false)}
              className="text-white hover:bg-orange-500 hover:text-white transition-colors"
            >
              Docs
            </MenuItem>
            <MenuItem
              icon={<Settings className="w-5 h-5" />}
              component={<Link to="/dashboard" />}
              onClick={() => setToggled(false)}
              className="text-white hover:bg-orange-500 hover:text-white transition-colors"
            >
              Dashboard
            </MenuItem>
          </SidebarMenu>
        </Sidebar>
      </div>
    </>
  );
};
