import { LoginForm } from "@/components/auth/LoginForm";
import { LoginResponse } from "@shared/types";

interface LoginPageProps {
  onLoginSuccess: (response: LoginResponse) => void;
}

export default function Login({ onLoginSuccess }: LoginPageProps) {
  return <LoginForm onLoginSuccess={onLoginSuccess} />;
}
