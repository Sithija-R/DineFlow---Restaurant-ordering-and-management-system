import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User,
  UserPlus,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@dineflow.com");
  const [password, setPassword] = useState("admin123");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const registerFields = [
    {
      id: "register-name",
      label: "Administrator Name",
      type: "text",
      placeholder: "John Doe",
      value: name,
      onChange: setName,
      icon: User,
    },
    {
      id: "register-email",
      label: "Administrator Email",
      type: "email",
      placeholder: "admin@dineflow.com",
      value: email,
      onChange: setEmail,
      icon: Mail,
    },
    {
      id: "register-password",
      label: "Security Password",
      type: "password",
      placeholder: "••••••••",
      value: password,
      onChange: setPassword,
      icon: Lock,
    },
    {
      id: "confirm-password",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      value: confirmPassword,
      onChange: setConfirmPassword,
      icon: Lock,
    },
  ] as const;

  // LOGIN
  const handleLogin: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login({ email, password });
      toast.add({
        title: "Login successful",
        description: "Welcome back to the DineFlow admin portal.",
        type: "success",
      });
      setIsLoading(false);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.add({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid email or password.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  // REGISTER
  const handleRegister: React.SubmitEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter the administrator name.",
        type: "warning",
      });
      return;
    }

    if (password.length < 6) {
      toast.add({
        title: "Weak password",
        description: "Password must contain at least 6 characters.",
        type: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.add({
        title: "Passwords do not match",
        description: "Please make sure both passwords are identical.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password, role: "ADMIN" });
      toast.add({
        title: "Admin account created",
        description:
          "Your administrator account has been created successfully.",
        type: "success",
      });
      setIsLoading(false);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.add({
        title: "Registration failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create the administrator account.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleShowRegister = () => {
    setIsRegistering(true);

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleShowLogin = () => {
    setIsRegistering(false);

    setName("");
    setEmail("admin@dineflow.com");
    setPassword("admin123");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden ">
      <Card className="w-full max-w-md bg-slate-900/90  border-slate-800 text-slate-100 shadow-2xl backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-4 ">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isRegistering ? (
                <UserPlus className="w-7 h-7 text-orange-400" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-orange-400" />
              )}
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-extrabold text-white">
              {isRegistering ? "Create Admin Account" : "DineFlow Admin Portal"}
            </CardTitle>

            <CardDescription className="text-xs text-slate-400 mt-2">
              {isRegistering
                ? "Register a new restaurant administrator"
                : "Login as administrator"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* LOGIN */}
          {!isRegistering && (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="text-xs text-slate-300"
                  >
                    Administrator Email
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dineflow.com"
                      className="pl-10 bg-slate-950 border-slate-800 text-white  focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-xs text-slate-300"
                  >
                    Security Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-slate-950 border-slate-800 text-white  focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Login to Management
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1 bg-slate-800" />
                <span className="text-[11px] text-slate-500">OR</span>
                <Separator className="flex-1 bg-slate-800" />
              </div>

              {/* Registration */}
              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Need an administrator account?
                </p>

                <Button
                  type="button"
                  variant="link"
                  onClick={handleShowRegister}
                  className="mt-1 text-orange-400 hover:text-orange-300"
                >
                  Create Admin Account
                </Button>
              </div>
            </>
          )}

          {/* REGISTRATION */}

          {isRegistering && (
            <>
              <form onSubmit={handleRegister} className="space-y-5">
                {registerFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div key={field.id} className="space-y-2">
                      <Label
                        htmlFor={field.id}
                        className="text-xs text-slate-300"
                      >
                        {field.label}
                      </Label>

                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                        <Input
                          id={field.id}
                          type={field.type}
                          required
                          minLength={
                            field.id === "register-password" ||
                            field.id === "confirm-password"
                              ? 6
                              : undefined
                          }
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          className="pl-10 bg-slate-950 border-slate-800 text-white  focus-visible:ring-orange-500"
                        />
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Admin Account
                      <UserPlus className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1 bg-slate-800" />
                <span className="text-[11px] text-slate-500">OR</span>
                <Separator className="flex-1 bg-slate-800" />
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleShowLogin}
                  className="text-orange-400 hover:text-orange-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Staff Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
