import { useQuery } from "@tanstack/react-query";

import { fetchMe } from "@/apis/auth/auth";
import { authKeys } from "@/apis/auth/keys";

export const useMeQuery = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchMe,
    retry: false,
  });
