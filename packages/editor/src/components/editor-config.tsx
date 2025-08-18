import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";

interface EditorConfig {
  apiHost: string;
}

const defaultConfig: EditorConfig = {
  apiHost: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:4000",
};

const EditorConfigContext = createContext<EditorConfig>(defaultConfig);

interface EditorConfigProviderProps {
  children: ReactNode;
  config?: Partial<EditorConfig>;
}

export const EditorConfigProvider: React.FC<EditorConfigProviderProps> = ({
  children,
  config = {},
}) => {
  const mergedConfig = { ...defaultConfig, ...config };

  return (
    <EditorConfigContext.Provider value={mergedConfig}>
      {children}
    </EditorConfigContext.Provider>
  );
};

export const useEditorConfig = () => {
  const context = useContext(EditorConfigContext);
  if (!context) {
    throw new Error(
      "useEditorConfig must be used within an EditorConfigProvider",
    );
  }
  return context;
};
