import { useState, useMemo } from "react";
import type { ReactExtensions, UseRemirrorReturn } from "@remirror/react";
import { EditorComponent, Remirror, ThemeProvider } from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";
import type { AnyExtension, RemirrorEventListener } from "remirror";
import { Box } from "theme-ui";
import { TableComponents } from "@remirror/extension-react-tables";
import { HolderAtomPopupComponent } from "./extension-holder/holder-popover";
import { Toolbar } from "./toolbar";
import { SlashSuggestor } from "./extensions/use-slash";

export interface ContentState {
  readonly doc?: string;
  readonly content?: any;
}
/**
 * Suggetion Component for Holder
 * @param tokens All insertable tokens listed
 * @returns
 */
const HolderSuggestComponent = ({ tokens }: any) => {
  const [mentionState, setMentionState] = useState<any>();
  // const commands = useCommands();

  const items = useMemo(() => {
    const allItems = tokens;

    if (!allItems) {
      return [];
    }

    const query = mentionState?.query?.full.toLowerCase() ?? "";
    return allItems
      .filter((item: any) => item.label.toLowerCase().includes(query))
      .sort();
  }, [mentionState, tokens]);

  return <HolderAtomPopupComponent onChange={setMentionState} items={items} />;
};

/**
 * Content Editor Component
 * @param param0
 * @returns
 */
export function ContentEditor({
  editor: { manager, state },
  onChange,
  editable,
  tokens,
}: {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
  editable: boolean;
  tokens: any;
}) {
  const theme = {
    fontFamily: {
      default: "Georgia,serif",
    },
  };

  const [isFullWidth, setIsFullWidth] = useState(false);

  const handleWidthToggle = (width: boolean) => {
    setIsFullWidth(width);
  };

  return (
    <Box
      sx={{
        ".remirror-editor-wrapper": {
          pt: 0,
          px: 0,
        },
        ".remirror-theme .ProseMirror": {
          borderRadius: "0 0 6px 6px",
          minHeight: "45vh",
          boxShadow: "none", // 'var(--theme-ui-colors-green-300) 0px 0px 0px 0px',
          border: 0,
          bg: "var(--theme-ui-colors-gray-200)",
          borderColor: "var(--theme-ui-colors-gray-500)",
          outline: "none",
          px: isFullWidth ? "7rem" : "3rem",
          py: isFullWidth ? "4rem" : "3rem",
          transition: "padding 0.3s ease-in-out",
        },
        ".remirror-theme .ProseMirror:focus": {
          boxShadow: "none", //'var(--theme-ui-colors-green-300) 0px 0px 0px 0px',
          border: "solid 1px var(--theme-ui-colors-gray-500)",
          bg: "var(--theme-ui-colors-gray-100)",
          outline: "none",
        },
        ".remirror-theme": {
          borderRadius: "6px",
          padding: 0,
          border: "solid 1px",
          borderColor: "var(--theme-ui-colors-gray-500)",
          bg: "#fff",
        },
        "hr.pagebreak-": {
          color: "blue",
          background: "#d3ead3",
          height: "0.5rem",
          border: 0,
          marginTop: "1rem",
          marginBottom: "1rem",
        },
        ".remirror-editor table": {
          my: 2,
        },

        ".remirror-editor th": {
          textAlign: "left",
          paddingTop: "0px",
          margin: 0,
          background: "var(--theme-ui-colors-gray-300)",
        },

        ".page-break-block": {
          display: "flex",
          backgroundColor: "#dfdfdf",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "4px",
          paddingBottom: "4px",
        },
        ".page-break-block::after, .page-break-block::before": {
          content: '""',
          flex: 1,
          borderBottom: "1px dashed #000",
        },

        ".page-break-block .page-break": {
          display: "none",
        },
        ".remirror-editor tr td": {
          textAlign: "left",
          paddingLeft: "15px",
          paddingTop: "0px",
          margin: 0,
        },
        ".remirror-table-tbody-with-controllers>tr:nth-of-type(n + 2) th": {
          paddingLeft: "15px",
        },
        ".remirror-table-tbody-with-controllers th.remirror-table-controller":
          {},
      }}
    >
      <AllStyledComponent theme={theme}>
        <ThemeProvider
          theme={{
            color: {
              // outline: 'soli',
              // border: 'solid 1px #eee',
              text: "none",
              primary: "#999",
            },
            boxShadow: {
              1: "none",
              2: "none",
              3: "none",
            },
            space: {
              1: "1rem",
              2: "16px",
              3: "2rem",
            },
          }}
        >
          <Remirror
            manager={manager}
            state={state}
            onChange={onChange}
            editable={editable}
          >
            {editable && <Toolbar onWidthToggle={handleWidthToggle} />}

            {/* <Count */}
            <EditorComponent />
            <SlashSuggestor />
            <HolderSuggestComponent tokens={tokens} />
            <TableComponents />
          </Remirror>
        </ThemeProvider>
      </AllStyledComponent>
    </Box>
  );
}
