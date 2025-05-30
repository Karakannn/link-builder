"use client";

import { DndContext } from "@dnd-kit/core";

type DndContextProviderProps = {
  children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {
  return <DndContext>{children}</DndContext>;
};
