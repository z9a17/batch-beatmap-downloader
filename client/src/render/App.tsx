import React, { useEffect, useMemo, useState } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Menu } from "./components/layout/Menu";
import { Changelog } from "./pages/Changelog";
import { Downloads } from "./pages/Downloads";
import { Home } from "./pages/Home";
import { Query } from "./pages/Query";
import { Status } from "./pages/Status";
import "./index.css";

const pageDetails: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview",
    description: "Configure osu! folders, download locations, and transfer limits.",
  },
  "/query": {
    title: "Discover",
    description: "Filter and sort the indexed beatmap catalogue.",
  },
  "/downloads": {
    title: "Downloads",
    description: "View queued downloads and transfer progress.",
  },
  "/status": {
    title: "Service",
    description: "Check metadata and download service availability.",
  },
  "/changelog": {
    title: "Release notes",
    description: "Version history and technical changes.",
  },
};

const ApplicationFrame = () => {
  const { pathname } = useLocation();
  const [version, setVersion] = useState("1.5.0-alpha.2");
  const currentPage = useMemo(() => pageDetails[pathname] ?? pageDetails["/"], [pathname]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    window.electron.getVersion().then(setVersion);
    window.electron.listenForErrors((error) => toast.error(error));
  }, []);

  return (
    <div className="app-shell">
      <div id="modal" />
      <Menu version={version} />
      <main className="app-workspace">
        <header className="app-titlebar">
          <div className="flex min-w-0 items-baseline gap-3">
            <h1 className="text-[18px] font-semibold tracking-[-0.015em] text-ink">{currentPage.title}</h1>
            <span className="hidden truncate text-[13px] text-faint xl:inline">{currentPage.description}</span>
          </div>
        </header>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<Query />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/status" element={<Status />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </div>
      </main>
      <ToastContainer autoClose={2600} theme="dark" position="bottom-right" />
    </div>
  );
};

const App = () => (
  <HashRouter>
    <ApplicationFrame />
  </HashRouter>
);

export default App;
