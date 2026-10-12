import { useSyncExternalStore } from "react";
import { users as seedUsers, archivedUsers as seedArchive, anomalies as seedAnomalies } from "./data";
import type { User, ArchivedUser, Anomaly } from "./data";

type State = { users: User[]; archive: ArchivedUser[]; anomalies: Anomaly[] };
let state: State = { users: seedUsers, archive: seedArchive, anomalies: seedAnomalies };
const listeners = new Set<() => void>();

export function setState(fn: (s: State) => State) {
  state = fn(state);
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(state),
  );
}

export const toggleUserStatus = (id: string) =>
  setState((s) => ({
    ...s,
    users: s.users.map((u) =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u,
    ),
  }));

export const restoreUser = (id: string) =>
  setState((s) => ({ ...s, archive: s.archive.filter((a) => a.id !== id) }));

export const resolveAnomaly = (id: string) =>
  setState((s) => ({
    ...s,
    anomalies: s.anomalies.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a)),
  }));
