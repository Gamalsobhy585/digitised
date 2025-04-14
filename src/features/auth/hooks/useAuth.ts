import { logout as logoutApi } from "../login/api";
import { removeServerCookie } from "../../../features/actions";
import { useRouter } from "../../../i18n/routing";
import { useMutation } from "react-query";

export function useLogout() {
  const router = useRouter();
  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      console.log("logout success");
      await removeServerCookie("token");
      await removeServerCookie("role");
      router.push("/login");
    },
  });

  return { logout, isLoggingOut };
}