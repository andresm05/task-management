import { Button } from "@/components/ui/button";
import { UserAuthForm } from "@/molecules/authForm";


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <UserAuthForm />
    </main>
  );
}
