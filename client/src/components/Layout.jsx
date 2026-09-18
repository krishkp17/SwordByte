import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setOpen(true)} />

        <main className="px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
