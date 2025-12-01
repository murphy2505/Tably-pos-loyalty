import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ModuleKey =
  | "pos"
  | "kds"
  | "products"
  | "categories"
  | "stock"
  | "customers"
  | "loyalty"
  | "settings";

type ModulesState = Record<ModuleKey, boolean>;

const DEFAULT_STATE: ModulesState = {
  pos: true,
  kds: true,
  products: true,
  categories: true,
  stock: true,
  customers: true,
  loyalty: true,
  settings: true,
};

interface ModulesContextValue {
  modules: ModulesState;
  toggleModule: (key: ModuleKey) => void;
  setModules: (next: ModulesState) => void;
}

const ModulesContext = createContext<ModulesContextValue | undefined>(
  undefined
);

export const ModulesProvider = ({ children }: { children: ReactNode }) => {
  const [modules, setModulesState] = useState<ModulesState>(DEFAULT_STATE);

  // Laden uit localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("tably.modules");
      if (raw) {
        const parsed = JSON.parse(raw) as ModulesState;
        setModulesState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Opslaan naar localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem("tably.modules", JSON.stringify(modules));
    } catch {
      // ignore
    }
  }, [modules]);

  const toggleModule = (key: ModuleKey) => {
    setModulesState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setModules = (next: ModulesState) => setModulesState(next);

  return (
    <ModulesContext.Provider value={{ modules, toggleModule, setModules }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModules = () => {
  const ctx = useContext(ModulesContext);
  if (!ctx) {
    throw new Error("useModules must be used within ModulesProvider");
  }
  return ctx;
};
