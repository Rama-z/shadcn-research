import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Lock, EyeOff, Eye, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { UnemLogo } from "@/components/organisms/svg-resource/unem-logo/UnemLogo";
// @ts-expect-error - Gradient.js is an untyped third-party library
import Gradient from "@/lib/gradient/Gradient.js";
import { useLoginMutation } from "../auth.hooks";
import { useThemeStore } from "@/store/theme-store";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const gradientRef = useRef<InstanceType<typeof Gradient> | null>(null);

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Detect local system mode for theme in login form
    const isDarkMode = getSystemTheme();
    console.log("is dark mode", isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Initialize Stripe WebGL gradient
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
    gradientRef.current = gradient;

    return () => {
      // Cleanup on unmount
      gradientRef.current?.disconnect?.();
    };
  }, []);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setLoginError(null);

      try {
        await loginMutation.mutateAsync({
          username: value.username,
          password: value.password,
        });
        // AuthGate in App.tsx automatically switches to dashboard
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (error as Error)?.message ??
          "Login failed. Please check your credentials.";
        setLoginError(message);
      } finally {
        setIsLoading(false);
        toggleTheme();
      }
    },
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white font-sans">
      {/* Stripe WebGL Gradient Background */}
      <canvas
        id="gradient-canvas"
        data-transition-in
        className="absolute inset-0 z-0 h-full w-full"
      />

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
                <div className="flex items-center gap-2 text-general-muted-foreground">
                  <span className="text-[14px] font-medium ">Network Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-[20px] font-semibold leading-[28px] text-general-foreground">
              Log In to your Account
            </h1>
            <p className="text-general-muted-foreground] text-[14px] leading-[20px]">
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
                onChange: ({ value }: { value: string }) => {
                  const result = loginSchema.shape.username.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1">
                  <Label
                    htmlFor={field.name}
                    className="flex items-center gap-0.5 text-[14px] font-medium text-general-foreground"
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
                      className={`h-[48px] w-full rounded-[8px] border-[0.5px]  border-[#E5E5E5] pl-10 text-[14px] text-general-foreground focus-visible:ring-1 focus-visible:ring-[#172554] ${
                        field.state.meta.errors.length > 0 ? "border-red-500" : ""
                      }`}
                      style={{ backgroundColor: "transparent" }}
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
                onChange: ({ value }: { value: string }) => {
                  const result = loginSchema.shape.password.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1">
                  <Label
                    htmlFor={field.name}
                    className="flex items-center gap-0.5 text-[14px] font-medium text-general-foreground"
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
                      className={`h-[48px] w-full rounded-[8px] border-[0.5px] border-[#E5E5E5] px-10 text-[14px] text-general-foreground focus-visible:ring-1 focus-visible:ring-[#172554] ${
                        field.state.meta.errors.length > 0 ? "border-red-500" : ""
                      }`}
                      style={{ backgroundColor: "transparent" }}
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

            {/* Login Error Message */}
            {loginError && (
              <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {loginError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="h-[48px] w-full rounded-[8px] bg-general-primary font-medium text-general-primary-foreground transition-colors hover:bg-primary-foreground hover:text-black"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Log in
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-[48px] w-full rounded-[8px] font-medium text-general-primary hover:bg-blue-50 hover:text-[#1e3a8a]"
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
