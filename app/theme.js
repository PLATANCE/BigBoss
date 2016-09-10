import { fade } from 'material-ui/utils/colorManipulator';

import {
orange600, orange800,
grey100, grey300, grey400, grey500,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

export const muiTheme = {
  palette: {
    primary1Color: orange600,
    primary2Color: orange800,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: orange600,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};
