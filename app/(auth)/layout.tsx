
import React from "react";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className=" w-full">
      <div className="h-full flex flex-col justify-center">
        {children}
      </div>
    </main>
  );
}
