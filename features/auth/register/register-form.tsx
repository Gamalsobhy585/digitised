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
// import { loginSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { register as registerApi } from "./api";
import { registerSchema } from "../schemas";
import { Link, useRouter } from "../../../i18n/routing";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { User } from "../login/types";
import { setServerCookie } from "../../../features/actions";
import { useAuth } from "../../../context/AuthContext";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const t = useTranslations("Auth");
  const { setIsAuthenticated } = useAuth();
  const { mutate: register, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof registerSchema>) => registerApi(data),
    onSuccess: () => {
      console.log("register success");
      toast.success(t("register_success_toast"));
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("register_error_toast"));
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
          <Image src="/logo.webp" alt="logo" width={100} height={100} />
          <CardTitle className="text-2xl">{t("register_title")}</CardTitle>
          <CardDescription>{t("register_description")}</CardDescription>
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
                        <FormLabel>{t("name_label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("name_placeholder")}
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
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading}
                >
                  {t("register_button")}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    {t("continue_with")}
                  </span>
                </div>
               
                <p className="text-center">
                  {t("already_have_account")}{" "}
                  <Link href="/login" className="text-primary underline">
                    {t("login_link")}
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
