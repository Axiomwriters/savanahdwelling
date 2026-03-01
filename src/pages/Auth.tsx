import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Home, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Auth() {
  // const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate()
  // const [showPassword, setShowPassword] = useState(false);
  // const [loginType, setLoginType] = useState<"user" | "agent" | "professional">("user");

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  // const { signIn, signUp, isAuthenticated, mockSignIn } = useAuth();
  // const navigate = useNavigate();
  // const location = useLocation();

  // Get the page they were trying to visit, or default to home
  // @ts-ignore - 'from' might not exist on state type
  const from = location.state?.from?.pathname || "/";



  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     if (activeTab === "login") {
  //       const { error } = await signIn(formData.email, formData.password);

  //       if (error) {
  //         toast.error(error.message || "Failed to sign in");
  //         setIsLoading(false);
  //         return;
  //       }

  //       setShowSuccess(true);
  //       setTimeout(() => {
  //         toast.success("Successfully logged in!");
  //         // Redirect based on login type (simulated for now as role is handled by backend)
  //         if (loginType === "agent") navigate("/agent");
  //         else if (loginType === "professional") navigate("/professional");
  //         else navigate("/", { replace: true });
  //       }, 1500);
  //     } else {
  //       if (!formData.name) {
  //         toast.error("Please enter your full name");
  //         setIsLoading(false);
  //         return;
  //       }

  //       const { error } = await signUp(formData.email, formData.password, formData.name);

  //       if (error) {
  //         toast.error(error.message || "Failed to sign up");
  //         setIsLoading(false);
  //         return;
  //       }

  //       setShowSuccess(true);
  //       setTimeout(() => {
  //         toast.success(`Account created! Welcome, ${loginType === 'professional' ? 'Professional' : loginType === 'agent' ? 'Agent' : 'User'}!`);

  //         if (loginType === "agent") navigate("/become-agent");
  //         else if (loginType === "professional") navigate("/professional");
  //         else navigate("/", { replace: true });
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred");
  //     setIsLoading(false);
  //   }
  // };

  // const handleSocialLogin = async (provider: string) => {
  //   if (provider === "Google") {
  //     setIsLoading(true);

  //     // Simulate network delay for realism
  //     setTimeout(async () => {
  //       const { error } = await mockSignIn(loginType);
  //       setIsLoading(false);
        
  //       if (error) {
  //         toast.error(error.message || "Failed to sign in");
  //         return;
  //       }

  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         toast.success(`Successfully logged in as ${loginType}!`);
  //         if (loginType === "agent") navigate("/agent");
  //         else if (loginType === "professional") navigate("/professional");
  //         else navigate("/", { replace: true });
  //       }, 1500);
  //     }, 1000);

  //     return;
  //   }
  //   toast.info(`${provider} login coming soon!`);
  // };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-background animate-fade-in">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">PropertyHub</span>
          </Link>

          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {activeTab === "login" ? "Log in to your account" : "Create an account"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "login"
                ? "Welcome back! Please enter your details."
                : "Start your journey with us today."}
            </p>
          </div> */}

          {/* Login Type Selector (Only for Login) */}
          {/* {activeTab === "login" && (
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setLoginType("user")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === "user"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                User
              </button>
              <button
                onClick={() => setLoginType("agent")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === "agent"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Agent
              </button>
              <button
                onClick={() => setLoginType("professional")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === "professional"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Professional
              </button>
            </div>
          )} */}
          <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base transition-all duration-300"
              disabled={isLoading}
              onClick={() => navigate('/sign-in')}
            >
              <SignInButton />
            </Button>
            <Button
              type="button"
              className="w-full bg-primary mt-3 hover:bg-primary/90 text-primary-foreground h-11 text-base transition-all duration-300"
              disabled={isLoading}
              onClick={() => navigate('/sign-up')}
            >
              <SignUpButton />
            </Button>
          
          {/* <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-muted/50"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-muted/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === "login" && (
              <div className="flex justify-end">
                <Link
                  to="/auth/reset"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : activeTab === "login" ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-full h-11 bg-background hover:bg-muted border-border transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {activeTab === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
              className="ml-1 font-semibold text-primary hover:underline transition-all"
            >
              {activeTab === "login" ? "Sign up" : "Log in"}
            </button>
          </div> */}
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="relative z-10 text-center p-12 max-w-lg">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-primary/30 rotate-12 hover:rotate-0 transition-all duration-500">
            <Home className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Find your dream property with confidence
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Join thousands of users, agents, and certified professionals in the most trusted real estate ecosystem.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-scale-in" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
              <p className="text-muted-foreground">
                Redirecting you to your dashboard...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
