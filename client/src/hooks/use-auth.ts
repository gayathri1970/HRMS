import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type LoginInput = z.infer<typeof api.auth.login.input>;

export function useLogin() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const validated = api.auth.login.input.parse(data);
      
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        let errorMessage = "Failed to login";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If parsing fails, stick to default
        }
        throw new Error(errorMessage);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome Back",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message,
      });
    }
  });
}
