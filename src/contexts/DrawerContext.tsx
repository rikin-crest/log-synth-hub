import React, { createContext, useContext, useState, ReactNode } from "react";

type DrawerContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDrawer: (nextOpen: boolean) => void;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
