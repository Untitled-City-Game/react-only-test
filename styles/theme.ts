import {
  colorsTuple,
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
} from '@mantine/core';

const themeOverride = createTheme({
  primaryShade: 7,
  primaryColor: "actionColor",
  white: "#FFFFFF",
  colors: {
	  paper: colorsTuple("#FFFFFF"),
    red: colorsTuple("#E51938"),
    green: colorsTuple("#00A950"),
    blue: colorsTuple("#0076C0"),
    grey: colorsTuple("#A1A3A1"),
    yellow: colorsTuple("#FFD200"),
    water: colorsTuple("#79BDE8"),
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
