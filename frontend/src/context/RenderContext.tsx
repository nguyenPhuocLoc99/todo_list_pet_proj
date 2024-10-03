import React, { createContext, useContext, useState } from "react";

type RenderContextType = {
  key: number;
  refreshApp: () => void;
};

const RenderContext = createContext<RenderContextType>({
  key: 0,
  refreshApp: () => {},
});

export const RenderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [key, setKey] = useState(0);

  const refreshApp = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <RenderContext.Provider value={{ key, refreshApp }}>
      {children}
    </RenderContext.Provider>
  );
};

export const useRenderContext = () => {
  const context = useContext(RenderContext);
  if (!context === undefined)
    throw new Error("useRenderContext must be used within an RenderProvider");
  return context;
};
