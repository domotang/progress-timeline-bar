import React, { createContext, useMemo } from "react";

const TemplateContext = createContext(null);

function PTBTemplateContext({ template, styleOptions, children }) {
  const Template = useMemo(() => template(styleOptions));
  return (
    <TemplateContext.Provider value={Template}>
      {children}
    </TemplateContext.Provider>
  );
}

export { TemplateContext, PTBTemplateContext };
