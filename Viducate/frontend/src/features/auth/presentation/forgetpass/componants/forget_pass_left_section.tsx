import { useState } from "react";
import { z } from "zod";
import { CustomInput } from "../../../../../core/componants/custom_input";
import { CustomButton } from "../../../../../core/componants/custum_btn";

const schema = z.object({
  email: z.email(),
});

export function ForgetPassLeftSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    const result = schema.safeParse({ email: value });

    if (!result.success) {
      setError(result.error.issues[0].message);
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    const result = schema.safeParse({ email });

    if (!result.success) {
      setError("Please write a valid email");
      return;
    }
    // here i will call the use case of reset link
  };
  return (
    <div className="w-full">
      <CustomInput
        label="Email address"
        type="email"
        value={email}
        placeholder="student@university.edu"
        error={error}
        onChange={handleChange}
      />

      <CustomButton
        type="submit"
        onClick={handleSubmit}
        disabled={!!error || email.length === 0}
      >
        Send Reset Link
      </CustomButton>
    </div>
  );
}
