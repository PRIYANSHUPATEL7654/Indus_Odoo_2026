import { create } from "zustand";

interface Crumb {
    label: string;
    link?: string;
}

interface BreadcrumbState {
    crumbs: Crumb[];
    setBreadcrumb: (crumbs: Crumb[]) => void;
    reset: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    crumbs: [],
    setBreadcrumb: (crumbs) => set({ crumbs }),
    reset: () => set({ crumbs: [] }),
}));
