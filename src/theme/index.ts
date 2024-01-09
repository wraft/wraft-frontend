import { Theme } from 'theme-ui';

import theme from './basic';
import colors from './colors';
import styles from './styles';
import alerts from './variants/alerts';
import buttons from './variants/buttons';
import forms from './variants/forms';
import layout from './variants/layout';
import links from './variants/links';
import text from './variants/text';

const makeTheme = <T extends Theme>(t: T): T => t;

export const themes = makeTheme({
  ...theme,
  colors,
  buttons,
  forms,
  text,
  links,
  layout,
  alerts,
  styles,
});

export default themes;
