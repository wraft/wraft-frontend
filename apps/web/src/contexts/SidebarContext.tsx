import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';

type SidebarMode = 'expanded' | 'collapsed' | 'hidden';

interface SidebarContextValue {
  mode: SidebarMode;
  mobileOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const COLLAPSED_KEY = 'wraft-sidebar-collapsed';

const getBreakpoint = (): SidebarMode => {
  if (typeof window === 'undefined') return 'expanded';
  if (window.innerWidth < 768) return 'hidden';
  if (window.innerWidth < 1024) return 'collapsed';
  return 'expanded';
};

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [manualCollapse, setManualCollapse] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });
  const [breakpointMode, setBreakpointMode] = useState<SidebarMode>(() =>
    getBreakpoint(),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onResize = () => setBreakpointMode(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router.asPath]);

  const mode: SidebarMode =
    breakpointMode === 'hidden'
      ? 'hidden'
      : breakpointMode === 'collapsed' || manualCollapse
        ? 'collapsed'
        : 'expanded';

  const isCollapsed = mode === 'collapsed' || mode === 'hidden';

  const toggle = useCallback(() => {
    if (breakpointMode === 'hidden') {
      setMobileOpen((prev) => !prev);
    } else {
      setManualCollapse((prev) => {
        localStorage.setItem(COLLAPSED_KEY, String(!prev));
        return !prev;
      });
    }
  }, [breakpointMode]);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{
        mode,
        mobileOpen,
        isCollapsed,
        toggle,
        openMobile,
        closeMobile,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
