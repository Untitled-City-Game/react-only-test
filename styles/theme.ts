import {
  colorsTuple,
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
} from '@mantine/core';


const themeOverride = createTheme({
  autoContrast: true,
  primaryShade: 7,
  fontFamily: "'Hanken Grotesk', sans-serif",
  primaryColor: "actionColor",
  white: "#FFFFFF",
  fontSizes: {
    xs: "0.75rem",
    sm: "0.8rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
  colors: {
	  paper: colorsTuple("#FFFFFF"),
    red: [
      "#ffe9ee",
      "#fed3da",
      "#f6a5b1",
      "#f07487",
      "#ea4b62",
      "#e7304b",
      "#e7213f",
      "#cd1332",
      "#b80a2b",
      "#a20023"
    ],
    green: [
      "#e6ffee",
      "#d3f9e0",
      "#a8f2c0",
      "#7aea9f",
      "#54e382",
      "#3bdf70",
      "#2bdd66",
      "#1bc455",
      "#0bae4a",
      "#00973c"
    ],
    blue: colorsTuple("#0076C0"),
    grey: [
      "#eef7ee",
      "#e4e9e4",
      "#cbcecb",
      "#b0b3b0",
      "#999b99",
      "#8a8d8a",
      "#828682",
      "#6f736f",
      "#616761",
      "#505a50"
    ],
    yellow: [
      "#fff8e1",
      "#ffefcb",
      "#ffdd9a",
      "#ffca64",
      "#ffba38",
      "#ffb01b",
      "#ffab09",
      "#e39500",
      "#cb8400",
      "#b07100"
    ],
    water: [
      "#e4f8ff",
      "#d2ecfc",
      "#a8d5f2",
      "#7bbee8",
      "#56aae0",
      "#3e9edc",
      "#2d98db",
      "#1b84c3",
      "#0675b0",
      "#00659c"
    ],
    roadGrey: colorsTuple("#C4CDC7"),
    grass: colorsTuple("#CFE5A7"),
    grassDark: colorsTuple("#9BB965"),
    secondaryColor: [
      "#e5f8ff",
      "#d0edff",
      "#9fd8fd",
      "#6cc3fb",
      "#47b1fa",
      "#32a6fa",
      "#26a0fb",
      "#188be0",
      "#007cc9",
      "#006bb2"
    ],
    actionColor:  [
      "#ffe9ee",
      "#fed3da",
      "#f6a5b1",
      "#f07487",
      "#ea4b62",
      "#e7304b",
      "#e7213f",
      "#cd1332",
      "#b80a2b",
      "#a20023"
    ]
  }

});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
