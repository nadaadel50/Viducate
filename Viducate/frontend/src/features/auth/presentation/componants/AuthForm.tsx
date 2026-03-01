import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../context/auth_context";
import { useContext } from "react";

type Props = {
  type: "login" | "signup";
  onSubmit: (data: any) => void;
};

export default function AuthForm({ type, onSubmit }: Props) {
const { loading, error } = useContext(AuthContext)!;
  const schema =
    type === "login"
      ? z.object({
          email: z.string().email("Invalid email"),
          password: z.string().min(6, "Password must be at least 6 chars"),
        })
      : z.object({
          name: z.string().min(3, "Name is required"),
          email: z.string().email("Invalid email"),
          password: z.string().min(6, "Password must be at least 6 chars"),
        });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {type === "signup" && (
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-3 border rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message as string}
            </p>
          )}
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-3 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full p-3 border rounded-lg"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>

      <button
  disabled={loading}
  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
>
  {loading ? "Please wait..." : type === "login" ? "Login" : "Sign Up"}
</button>
    </form>
    
  );
  
}