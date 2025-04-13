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
import { Link, useRouter } from "../../../i18n/routing";
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
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const isProvider = searchParams.get("role") === "provider";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const t = useTranslations("Auth");

  const { mutate: login, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) => loginApi(data),
    onSuccess: async (data) => {
      // console.log(data.)
      toast.success(t("login_success_toast"));
      console.log(data);
      const user = data.data as User;

      localStorage.setItem("user", JSON.stringify(user));

      // localStorage.setItem("token", user.token);
      await setServerCookie([
        { name: "token", value: user.token },
      ]);
      setIsAuthenticated(true);
     
        router.push("/");
      
    },
    onError: (error) => {
      console.error("Login failed", error);
      toast.error(t("login_error_toast"));
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
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("welcome")}</CardDescription>
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
                        <FormLabel>{t("email_label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("email_placeholder")}
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
                        <Label htmlFor="password">{t("password_label")}</Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <Link
                          href="/forget-password"
                          className="text-primary block w-full text-end text-sm"
                        >
                          {t("forgot_password")}
                        </Link>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading}
                >
                  {t("submit_button")}
                </Button>

                {!isProvider && (
                  <>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        {t("or_continue_with")}
                      </span>
                    </div>
                   
                    <p className="text-center">
                      {t("register_prompt")}{" "}
                      <Link href="/register" className="text-primary underline">
                        {t("register_link")}
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      ;
    </div>
  );
}
