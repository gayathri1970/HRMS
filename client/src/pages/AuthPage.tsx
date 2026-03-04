import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@shared/routes";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type LoginFormValues = z.infer<typeof api.auth.login.input>;

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const loginMutation = useLogin();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: {
      email: "",
      password: "",
      role: "employee",
    },
  });

  const currentRole = form.watch("role");

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const handleMicrosoftLogin = () => {
    // In a real app, this would redirect to Microsoft SSO URL
    console.log("Initiating Microsoft SSO login...");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[420px]">
        {/* Main Card */}
        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-gray-100/50">
          
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKVW_LlI3J3jD3Iet9soKQKB4Kbyk7qZINPw&s" 
              alt="Company Logo" 
              className="h-12 mx-auto object-contain"
            />
          </div>

          {/* Role Toggle Switch */}
          <div className="flex mx-auto w-fit p-1 bg-gray-100/80 rounded-[0.5rem] mb-8 border border-gray-200/50">
            <button
              type="button"
              onClick={() => form.setValue("role", "employee")}
              className={cn(
                "px-6 py-2 rounded-[0.5rem] text-sm font-semibold transition-all duration-300",
                currentRole === "employee"
                  ? "bg-white text-[#4A90D9] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => form.setValue("role", "client")}
              className={cn(
                "px-6 py-2 rounded-[0.5rem] text-sm font-semibold transition-all duration-300",
                currentRole === "client"
                  ? "bg-white text-[#4A90D9] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Client
            </button>
          </div>

          {/* Headings */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "block w-full rounded-lg border-gray-200 px-4 py-3 text-sm transition-all",
                    "border border-gray-200 bg-white",
                    "placeholder:text-gray-400 text-gray-900",
                    "focus:border-[#4A90D9] focus:outline-none focus:ring-4 focus:ring-[#4A90D9]/10",
                    form.formState.errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={cn(
                    "block w-full rounded-lg border-gray-200 px-4 py-3 pr-12 text-sm transition-all",
                    "border border-gray-200 bg-white",
                    "placeholder:text-gray-400 text-gray-900",
                    "focus:border-[#4A90D9] focus:outline-none focus:ring-4 focus:ring-[#4A90D9]/10",
                    form.formState.errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a 
                href="#" 
                className="text-sm font-medium text-[#4A90D9] hover:text-[#3876b5] transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={cn(
                "w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white",
                "bg-[#6B9FD4] hover:bg-[#4A90D9] shadow-sm hover:shadow-md",
                "transition-all duration-200 ease-in-out transform active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90D9]",
                loginMutation.isPending && "opacity-70 cursor-not-allowed transform-none"
              )}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or continue with</span>
            </div>
          </div>

          {/* Microsoft Button */}
          <div className="mt-8">
            <button
              onClick={handleMicrosoftLogin}
              type="button"
              className={cn(
                "w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-medium text-gray-700",
                "bg-white border border-gray-300 hover:bg-gray-50",
                "transition-all duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
              )}
            >
              <div className="ms-grid-logo">
                <div className="bg-[#F25022]"></div>
                <div className="bg-[#7FBA00]"></div>
                <div className="bg-[#00A4EF]"></div>
                <div className="bg-[#FFB900]"></div>
              </div>
              Sign in with Microsoft
            </button>
          </div>

          {/* Footer inside the white box */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Need help? Contact your account manager
          </p>

        </div>

      </div>
    </div>
  );
}
