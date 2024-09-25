import {
  WormholeConnectTheme,
  WormholeConnectPartialTheme,
} from "@wormhole-foundation/wormhole-connect";
import React, { useCallback, useMemo } from "react";
import { getObjectPath, setObjectPathImmutable } from "../utils";

export default function ColorPicker({
  customTheme,
  setCustomTheme,
  path,
  defaultTheme,
}: {
  customTheme: WormholeConnectPartialTheme | undefined;
  setCustomTheme: React.Dispatch<
    React.SetStateAction<WormholeConnectPartialTheme | undefined>
  >;
  path: string;
  defaultTheme: WormholeConnectTheme;
}) {
  const color = useMemo(
    () =>
      getObjectPath(customTheme, path) ||
      getObjectPath(defaultTheme, path) ||
      "#ffffff",
    [customTheme, path, defaultTheme]
  );
  const handleColorChange = useCallback(
    (color: string, event: any) => {
      setCustomTheme((prev) =>
        setObjectPathImmutable(prev || defaultTheme, path, color)
      );
    },
    [setCustomTheme, path, defaultTheme]
  );
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input type="color" value={color} onChange={(e) => {
        handleColorChange(e.target.value, e);
      }}/>
    </div>
  );
}
