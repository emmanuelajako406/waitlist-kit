"use client";

import { useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-stretch justify-center gap-4"
      >
        <Input
          type="email"
          required
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={status === "loading"}
        >
          Join now
        </Button>
      </form>

      {message && (
        <p className={`text-sm font-medium ${status === "success" ? "text-emerald-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}