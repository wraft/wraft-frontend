import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";

interface EditorConfig {
  apiHost: string;
  tokens?: any[];
}

const defaultConfig: EditorConfig = {
  apiHost: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:4000",
  tokens: undefined,
};

const EditorConfigContext = createContext<EditorConfig>(defaultConfig);

interface EditorConfigProviderProps {
  children: ReactNode;
  config?: Partial<EditorConfig>;
  tokens?: any[];
}

export const EditorConfigProvider: React.FC<EditorConfigProviderProps> = ({
  children,
  config = {},
  tokens,
}) => {
  const mergedConfig = { ...defaultConfig, ...config, tokens };

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
