import { useForm, type SubmitHandler } from "react-hook-form";
import { useResetPasswordMutation } from "@/redux/api/apiSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Eye, EyeOff, Loader2, Lock, XCircle } from "lucide-react";

import type { ResetPasswordFormData } from "@/types";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const navigate = useNavigate();
  const { token } = useParams();

  const [countdown, setCountdown] = useState(3);

  const [resetPassword, { isLoading, isError, error, isSuccess }] =
    useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      data.token = token!;
      const response = await resetPassword(data).unwrap();
      toast.success(response.message);

      let seconds = 3;
      setCountdown(seconds);

      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) clearInterval(interval);
      }, 1000);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.data?.message);
    }
  };

  if (error) {
    if ((error as any).data?.code !== 410) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
          <Card className="w-full bg-zinc-900 max-w-md border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-zinc-50">
                Reset your password
              </CardTitle>
              <CardDescription className="text-zinc-300/70">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-50">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                    <Input
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min 6 characters" },
                        pattern: {
                          value:
                            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                          message:
                            "Password must contain at least one uppercase letter, one lowercase letter, number and one special character.",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70 hover:text-zinc-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300/70">
                    Password must be at least 6 characters long
                  </p>

                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-50">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                    <Input
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        minLength: { value: 6, message: "Min 6 characters" },
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70 hover:text-zinc-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                  variant={"outline"}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>

              <div className="flex flex-col gap-2">
                <div className="text-center text-sm">
                  <span className="text-zinc-300/60">
                    Remember your password?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="hover:underline text-zinc-200 font-medium"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <Card className="w-full bg-zinc-900 max-w-md border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc-50">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="w-full bg-zinc-900 max-w-md border-white/10">
              <CardContent className="pt-6 text-center space-y-6">
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Invalid or Expired Link
                  </h3>
                  <p className="text-zinc-300/70 text-sm">
                    This password reset link is invalid or has expired. Please
                    request a new password reset.
                  </p>
                </div>

                <Link to="/forgot-password">
                  <Button
                    className="w-full cursor-pointer "
                    variant={"outline"}
                  >
                    Request New Reset Link
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <div className="text-center text-sm">
                <span className="text-zinc-300/70">
                  Remember your password?{" "}
                </span>
                <Link
                  to="/login"
                  className="hover:underline text-zinc-200 font-medium"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <Card className="w-full bg-zinc-900 max-w-md border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc-50">
              Password Reset Complete
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Your password has been successfully updated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="w-full bg-zinc-900 max-w-md border-white/10">
              <CardContent className="pt-6 text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Password Updated Successfully
                  </h3>
                  <p className="text-zinc-300/70 text-sm">
                    Your password has been updated. You can now log in with your
                    new password.
                  </p>

                  <p className="text-sm text-zinc-100 mt-2">
                    Redirecting to login in{" "}
                    <span className="font-medium">{countdown}</span> second
                    {countdown !== 1 && "s"}...
                  </p>
                </div>

                <Link to="/login">
                  <Button
                    className="w-full cursor-pointer "
                    variant={"outline"}
                  >
                    Continue to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card className="w-full bg-zinc-900 max-w-md border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Reset your password
          </CardTitle>
          <CardDescription className="text-zinc-300/70">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-50">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                    pattern: {
                      value:
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, number and one special character.",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70 hover:text-zinc-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-300/70">
                Password must be at least 6 characters long
              </p>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-50">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                <Input
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70 hover:text-zinc-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
              variant={"outline"}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-col gap-2">
            <div className="text-center text-sm">
              <span className="text-zinc-300/60">Remember your password? </span>
              <Link
                to="/login"
                className="hover:underline text-zinc-200 font-medium"
              >
                Back to login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
