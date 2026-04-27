import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Lock, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { mockUsers } from "@/lib/mock-data";

export function LoginForm() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Force light mode for login form
    document.documentElement.classList.remove("dark");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", { username, password });
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
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white font-sans">
      {/* Background Mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <img
          src="/assets/images/mesh-bg.svg"
          alt="Background"
          className="h-full w-full scale-150 object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-[460px] px-6">
        {/* Form Container */}
        <div className="space-y-6 rounded-[16px] border border-gray-100 bg-white p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-[20px] font-semibold leading-[28px] text-[#0A0A0A]">
              Log In to your Account
            </h1>
            <p className="text-[14px] leading-[20px] text-[#737373]">
              Enter your username and password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1">
              <Label className="flex items-center gap-0.5 text-[14px] font-medium text-[#0A0A0A]">
                Username <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserRound size={20} strokeWidth={1.5} />
                </div>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  className="h-[48px] w-full rounded-[8px] border-[#E5E5E5] pl-10 text-[14px] text-black focus-visible:ring-1 focus-visible:ring-[#172554]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    backgroundColor: "white",
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label className="flex items-center gap-0.5 text-[14px] font-medium text-[#0A0A0A]">
                Password <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-[48px] w-full rounded-[8px] border-[#E5E5E5] px-10 text-[14px] text-black focus-visible:ring-1 focus-visible:ring-[#172554]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: "white",
                  }}
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="h-[48px] w-full rounded-[8px] bg-[#172554] font-medium text-white transition-colors hover:bg-[#1e3a8a]"
                isLoading={isLoading}
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

        {/* Footer Brand */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <img
              src="/assets/images/logo-telkomsel.png"
              alt="Telkomsel Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="h-6 w-[1px] bg-gray-300" />
            <div className="flex items-center gap-2 text-[#6B7280]">
              <img src="/assets/images/brand-icon.svg" alt="Network Icon" className="h-5 w-5" />
              <span className="text-[14px] font-medium">Network Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
