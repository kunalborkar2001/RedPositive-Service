"use client"

import Image from "next/image";
import { TableDemo } from "../components/TableDemo"
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TableDemo />
      </main>
    </NextUIProvider>
  );
}
