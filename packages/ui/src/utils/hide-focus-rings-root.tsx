import { createGlobalStyle } from "@xstyled/emotion";
import React, { useEffect, useState } from "react";

export const hideFocusRingsDataAttribute = "data-wui-hidefocusrings";

const HideFocusRingGlobalStyles = createGlobalStyle(
  () => `
    [${hideFocusRingsDataAttribute}] *:focus {
      outline: none;
    }
  `,
);

interface HideFocusRingsRootProps {
  children?: React.ReactNode;
  reactRootId: string;
}

export const HideFocusRingsRoot: React.FC<HideFocusRingsRootProps> = ({
  children,
  reactRootId,
}) => {
  const [hideFocusRings, setHideFocusRings] = useState(false);

  useEffect(() => {
    const eventName = hideFocusRings ? "keydown" : "mousemove";
    const toggleFocusRings = () => setHideFocusRings((x) => !x);

    window.addEventListener(eventName, toggleFocusRings);

    const rootElement = document.getElementById(reactRootId);
    if (rootElement) {
      hideFocusRings
        ? rootElement.setAttribute(hideFocusRingsDataAttribute, "true")
        : rootElement.removeAttribute(hideFocusRingsDataAttribute);
    }

    return () => {
      window.removeEventListener(eventName, toggleFocusRings);
    };
  }, [hideFocusRings, reactRootId]);

  return (
    <>
      <HideFocusRingGlobalStyles />
      {children}
    </>
  );
};
