"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { serviceFromApi, settingsFromApi } from "./catalog";
import { SERVICES, type Service } from "./data";
import { type SiteInfo } from "./site";

type CmsState = {
  settings: SiteInfo;
  services: Service[];
  ready: boolean;
};

const CmsContext = createContext<CmsState>({
  settings: settingsFromApi(),
  services: SERVICES,
  ready: false,
});

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CmsState["settings"]>(settingsFromApi());
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([api.publicSettings(), api.publicServices()]).then(([settingsRes, servicesRes]) => {
      if (cancelled) return;
      if (settingsRes.status === "fulfilled") {
        setSettings(settingsFromApi(settingsRes.value.settings));
      }
      if (servicesRes.status === "fulfilled") {
        const list = (servicesRes.value.services || []).map(serviceFromApi);
        if (list.length) setServices(list);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ settings, services, ready }), [settings, services, ready]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}

export function useSettings() {
  return useCms().settings;
}

export function useCatalog() {
  return useCms().services;
}
