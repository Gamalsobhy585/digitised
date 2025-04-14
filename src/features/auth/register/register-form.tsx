"use client";

import { cn } from "@/lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { register as registerApi } from "./api";
import { registerSchema } from "../schemas";
import Link from "next/link";
import { useRouter } from "../../../i18n/routing";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const { setIsAuthenticated } = useAuth();
  const { mutate: register, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof registerSchema>) => registerApi(data),
    onSuccess: () => {
      console.log("register success");
      toast.success("Registration successful");
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Registration failed");
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log(data);
    register(data);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 z-50 basis-full sm:basis-3/4 md:basis-1/2 lg:basis-1/3",
        className
      )}
      {...props}
    >
      <Card className="z-50 rounded-2xl">
        <CardHeader className="items-center">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
          <CardTitle className="text-2xl">Registeration</CardTitle>
          <CardDescription>Register Now</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center ">
          <Form {...form}>
            <form className="w-3/4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Name"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              
                <div className="grid gap-2">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter Your Password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="password_confirmation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                        <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="Retype Password"
                      autoComplete="new-password"
                      {...field}
                      />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading}
                >
                  Register
                </Button>
               
               
                <p className="text-center">
                 Already Have an account ? 
                  <Link href="/login" className="text-primary ms-2 underline">
                     Login
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
