"use client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
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
import { loginSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { login as loginApi } from "./api";
import { useRouter } from "../../../i18n/routing";
import Link from "next/link";
import { toast } from "react-toastify";
import { User } from "./types";
import { setServerCookie } from "../../actions";
import { useAuth } from "../../../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) => loginApi(data),
    onSuccess: async (data) => {
      toast.success("Login successful");
      const user = data.data as User;
      localStorage.setItem("user", JSON.stringify(user));
      await setServerCookie([
        { name: "token", value: user.token },
      ]);
      setIsAuthenticated(true);
      
      // Redirect to tasks page
      router.push("/tasks");
    },
    onError: (error) => {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 z-50 basis-full sm:basis-3/4 md:basis-1/2 lg:basis-1/3 ",
        className
      )}
      {...props}
    >
      <Card className="z-50 rounded-3xl py-6">
        <CardHeader className="items-center">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome!</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center ">
          <Form {...form}>
            <form className="w-3/4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
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
                            placeholder={"example@m.com"}
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
                            placeholder={"Enter Your Password "}

                            required
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
                 Login
                </Button>

               
                  <>
                  
                   
                    <p className="text-center">
                     Don't have an account?
                      <Link href="/register" className="text-primary underline">
                        Register now
                      </Link>
                    </p>
                  </>
               
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      ;
    </div>
  );
}
