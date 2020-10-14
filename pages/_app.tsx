import withReduxStore from '../lib/with-redux-store';
import { StoreProvider } from 'easy-peasy';
import { AppProps } from 'next/app';

import { ThemeProvider } from 'theme-ui';
import theme from '../src/utils/theme';
// import { ThemeProvider, CSSReset } from "@chakra-ui/core";

import { createGlobalStyle } from 'styled-components';
import 'react-day-picker/lib/style.css';
// import 'react-phone-number-input/style.css';
// import 'react-multi-carousel/lib/styles.css';
// import "react-dropzone-uploader/dist/styles.css";
import { ToastProvider } from 'react-toast-notifications';

const GlobalStyle = createGlobalStyle` 

.ProseMirror.remirror-editor {
  background: #fff;
  padding: 0;
  border: solid 1px #ddd;
  border-radius: 4px;
  line-height: 1.58;
  white-space: pre-wrap;
  padding-left: 7rem;
    padding-right: 7rem;
    padding-top: 2rem;
    padding-bottom: 3rem;

  h1 {
    font-size: 20px;
    font-weight: 400;
    margin-top: 24px;
    margin-bottom: 16px;
    color: #086ba5;
  }

  h2 {
    color: #086ba5;
  }
}
  .DayPicker{
    display:inline-block;font-size:1rem}.DayPicker-wrapper{position:relative;flex-direction:row;padding-bottom:1em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DayPicker-Months{display:flex;flex-wrap:wrap;justify-content:center}.DayPicker-Month{display:table;margin:0 1em;margin-top:1em;border-spacing:0;border-collapse:collapse;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DayPicker-NavButton{position:absolute;top:1em;right:1.5em;left:auto;display:inline-block;margin-top:2px;width:1.25em;height:1.25em;background-position:center;background-size:50%;background-repeat:no-repeat;color:#8b9898;cursor:pointer}.DayPicker-NavButton:hover{opacity:.8}.DayPicker-NavButton--prev{margin-right:1.5em;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC)}.DayPicker-NavButton--next{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAXRJREFUWAnN119ugjAcwPHWzJ1gnmxzB/BBE0n24m4xfNkTaOL7wOtsl3AXMMb+Vjaa1BG00N8fSEibPpAP3xAKKs2yjzTPH9RAjhEo9WzPr/Vm8zgE0+gXATAxxuxtqeJ9t5tIwv5AtQAApsfT6TPdbp+kUBcgVwvO51KqVhMkXKsVJFXrOkigVhCIs1Y4iKlWZxB1rX4gwlpRIIpa8SDkWmggrFq4IIRaJKCYWnSgnrXIQV1r8YD+1Vrn+bReagysIFfLABRt31v8oBu1xEBttfRbltmfjgEcWh9snUS2kNdBK6WN1vrOWxObWsz+fjxevsxmB1GQDfINWiev83nhaoiB/CoOU438oPrhXS0WpQ9xc1ZQWxWHqUYe0I0qrKCQKjygDlXIQV2r0IF6ViEBxVTBBSFUQQNhVYkHIVeJAtkNsbQ7c1LtzP6FsObhb2rCKv7NBIGoq4SDmKoEgTirXAcJVGkFSVVpgoSrXICGUMUH/QBZNSUy5XWUhwAAAABJRU5ErkJggg==)}.DayPicker-NavButton--interactionDisabled{display:none}.DayPicker-Caption{display:table-caption;margin-bottom:.5em;padding:0 .5em;text-align:left}.DayPicker-Caption>div{font-weight:500;font-size:1.15em}.DayPicker-Weekdays{display:table-header-group;margin-top:1em}.DayPicker-WeekdaysRow{display:table-row}.DayPicker-Weekday{display:table-cell;padding:.5em;color:#8b9898;text-align:center;font-size:.875em}.DayPicker-Weekday abbr[title]{border-bottom:none;text-decoration:none}.DayPicker-Body{display:table-row-group}.DayPicker-Week{display:table-row}.DayPicker-Day{display:table-cell;padding:.5em;border-radius:50%;vertical-align:middle;text-align:center;cursor:pointer}.DayPicker-WeekNumber{display:table-cell;padding:.5em;min-width:1em;border-right:1px solid #eaecec;color:#8b9898;vertical-align:middle;text-align:right;font-size:.75em;cursor:pointer}.DayPicker--interactionDisabled .DayPicker-Day{cursor:default}.DayPicker-Footer{padding-top:.5em}.DayPicker-TodayButton{border:none;background-color:transparent;background-image:none;box-shadow:none;color:#4a90e2;font-size:.875em;cursor:pointer}.DayPicker-Day--today{color:#d0021b;font-weight:700}.DayPicker-Day--outside{color:#8b9898;cursor:default}.DayPicker-Day--disabled{color:#dce0e0;cursor:default}.DayPicker-Day--sunday{background-color:#f7f8f8}.DayPicker-Day--sunday:not(.DayPicker-Day--today){color:#dce0e0}.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside){position:relative;background-color:#4a90e2;color:#f0f8ff}.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover{background-color:#51a0fa}.DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover{background-color:#f0f8ff}.DayPickerInput{display:inline-block}.DayPickerInput-OverlayWrapper{position:relative}.DayPickerInput-Overlay{position:absolute;left:0;z-index:1;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.15)
  }

  a{
    cursor: pointer;
  }

  em.holder {
    font-size: 90%;
    background: #c5ccf9;
    -webkit-text-decoration: none;
    text-decoration: none;
    font-style: normal;
    padding: 4px;
    padding-bottom: 3px;
    padding-top: 3px;
    font-weight: 600;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 6px;
    padding-bottom: 4px;
    border-radius: 2px;
  }

  em.no-holder {
    font-size: 90%;
    background: #ffc2c2;
    text-decoration: none;
    font-style: normal;
    padding: 4px;
    padding-bottom: 3px;
    padding-top: 3px;
  }
  
`;

interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

function MyApp({ Component, pageProps, reduxStore }: AppPropsWithRedux) {
  return (
    <StoreProvider store={reduxStore}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* <CSSReset /> */}
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default withReduxStore(MyApp);
