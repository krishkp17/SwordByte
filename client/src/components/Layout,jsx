import { useState } from "react";
import React from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
