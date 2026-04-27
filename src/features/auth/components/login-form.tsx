import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Lock, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { mockUsers } from "@/lib/mock-data";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { UnemLogo } from "@/components/organisms/svg-resource/unem-logo/UnemLogo";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Force light mode for login form
    document.documentElement.classList.remove("dark");
  }, []);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Login Attempt:", value);
      setIsLoading(true);

      // Simulate auth delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock login logic
      const mockUser = mockUsers[0];
      login({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
        role: mockUser.role,
      });
      setIsLoading(false);
    },
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white font-sans">
      {/* Background Video */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/assets/videos/login-animation.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Brand Identity
      <div className="mb-8 flex flex-col items-center gap-[2.67px]">
        <img
          src="/assets/images/brand-logo.png"
          alt="Brand Logo"
          className="h-8 w-auto object-contain"
        />
        <span className="text-[13.33px] font-normal leading-none tracking-[0.005em] text-[#737373]">
          Network Management
        </span>
      </div> */}

      <div className="relative z-10 w-full max-w-[460px] px-6">
        {/* Form Container */}
        <div className="space-y-3 rounded-[16px] bg-transparent p-6">
          {/* Brand Identity */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-4">
              <img
                src="/assets/images/logo-telkomsel.png"
                alt="Telkomsel Logo"
                className="h-10 w-auto object-contain"
              />
              {/* Horizontal */}
              <div className="flex flex-col">
                <UnemLogo />
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <span className="text-[14px] font-medium">Network Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-[20px] font-semibold leading-[28px] text-[#0A0A0A]">
              Log In to your Account
            </h1>
            <p className="text-[14px] leading-[20px] text-[#737373]">
              Enter your username and password.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Username Field */}
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) => {
                  const result = loginSchema.shape.username.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1">
                  <Label
                    htmlFor={field.name}
                    className="flex items-center gap-0.5 text-[14px] font-medium text-[#0A0A0A]"
                  >
                    Username <span className="text-[#DC2626]">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <UserRound size={20} strokeWidth={1.5} />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="Enter your username"
                      className={`h-[48px] w-full rounded-[8px] border-[#E5E5E5] pl-10 text-[14px] text-black focus-visible:ring-1 focus-visible:ring-[#172554] ${
                        field.state.meta.errors.length > 0 ? "border-red-500" : ""
                      }`}
                      style={{ backgroundColor: "white" }}
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[12px] text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const result = loginSchema.shape.password.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1">
                  <Label
                    htmlFor={field.name}
                    className="flex items-center gap-0.5 text-[14px] font-medium text-[#0A0A0A]"
                  >
                    Password <span className="text-[#DC2626]">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={20} strokeWidth={1.5} />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`h-[48px] w-full rounded-[8px] border-[#E5E5E5] px-10 text-[14px] text-black focus-visible:ring-1 focus-visible:ring-[#172554] ${
                        field.state.meta.errors.length > 0 ? "border-red-500" : ""
                      }`}
                      style={{ backgroundColor: "white" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showPassword ? (
                        <Eye size={20} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={20} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[12px] text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="h-[48px] w-full rounded-[8px] bg-[#172554] font-medium text-white transition-colors hover:bg-[#1e3a8a]"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Login
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-[48px] w-full rounded-[8px] font-medium text-[#172554] hover:bg-blue-50 hover:text-[#1e3a8a]"
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
