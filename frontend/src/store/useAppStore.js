import { create } from "zustand";

export const useAppStore = create((set) => ({
  resumeUploaded: false,
  domains: {},
  selectedDomain: null,
  jobs: [],

  setDomains: (domains) => set({ domains, resumeUploaded: true }),
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setJobs: (jobs) => set({ jobs })
}));