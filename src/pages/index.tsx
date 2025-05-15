import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type FormData = {
  firstName: string;
  lastName: string;
};

export default function Home() {
  const [serverResponse, setServerResponse] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          setServerResponse(errorData.title ?? "An error occurred.");
        } catch {
          setServerResponse("An error occurred.");
        }
        return;
      }

      const result = await response.json();
      if (result.fullName) {
        setServerResponse(`Full name: ${result.fullName}`);
      } else {
        setServerResponse(JSON.stringify(result));
      }
    } catch (error) {
      setServerResponse("An error occurred.");
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-sm mt-8"
        >
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">First name is required</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">Last name is required</p>
            )}
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Submit
          </button>
        </form>

        {serverResponse && (
          <p className="mt-4 text-center sm:text-left">{serverResponse}</p>
        )}
      </main>
    </div>
  );
}