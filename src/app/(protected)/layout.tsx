import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => (
  <AuthGuard>{children}</AuthGuard>
);

export default ProtectedLayout;
