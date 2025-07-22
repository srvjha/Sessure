import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/hooks";
import { Lock, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>

      <div className="max-w-7xl mx-auto px-4 py-16 text-zinc-50 ">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 mt-12">
            Secure Authentication System
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            A modern, secure authentication platform with advanced session
            management and administrative controls.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
               <Button className="w-34 h-10 bg-zinc-200 text-base text-black hover:bg-zinc-200">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
            ) : (
              <>
                <Button className="w-28 h-11 bg-zinc-200 text-base text-black hover:bg-zinc-200">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-32 h-11 bg-zinc-950 text-base text-zinc-100 border border-zinc-400 hover:bg-zinc-950/60 hover:text-zinc-100"
                >
                  <Link to="/docs">View Docs</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 ">
          {[
            {
              icon: <Lock className="h-6 w-6 text-black" />,
              title: "Secure Authentication",
              desc: "Supports both custom auth and Google OAuth for improved security and user convenience.",
            },
            {
              icon: <Users className="h-6 w-6 text-black" />,
              title: "Session Management",
              desc: "Monitor and control active sessions across all devices.",
            },
            {
              icon: <Shield className="h-6 w-6 text-black" />,
              title: "Admin Dashboard",
              desc: "Comprehensive user management with role-based access control and analytics.",
            },
          ].map(({ icon, title, desc }) => (
            <Card
              key={title}
              className="text-center border-none bg-black/20 text-black  shadow-xs hover:shadow-sm shadow-black transition-shadow"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-zinc-100 border border-zinc-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <CardTitle className="text-zinc-100 text-lg ">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-300 -mt-4">
                  {desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center mt-16">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
