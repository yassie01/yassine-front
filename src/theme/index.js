import { extendTheme } from "@chakra-ui/react";
import foundations from "./foundations";
import { breakpoints } from "./foundations/breakpoints";

const direction = "ltr";

const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
  cssVarPrefix: "chakra",
};

export const theme = {
  direction,
  ...foundations,
  config,
  breakpoints,
};

export default extendTheme(theme);
