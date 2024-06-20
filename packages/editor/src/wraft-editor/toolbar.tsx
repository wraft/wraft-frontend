import React from 'react';

import {
  CommandButton,
  HeadingLevelButtonGroup,
  Icon,
  InsertHorizontalRuleButton,
  ToggleBlockquoteButton,
  useActive,
  useCommands,
} from '@remirror/react';

// import styled from '@emotion/styled';
import { Divider, Box, Flex, Text } from 'theme-ui';

// import { Icon } from '@remirror/react';

// const Container = styled.div`
//   position: sticky;
//   top: 0;
//   z-index: 99;
//   background-color: #fff;
//   padding: 4px 20px;
// `;

export const Toolbar = () => {
  const commands = useCommands();
  const active = useActive(true);

  return (
    <Flex sx={{ bg: 'red.100', gap: 1 }}>
      <HeadingLevelButtonGroup showAll />
      <ToggleBlockquoteButton />
      <CommandButton
        commandName="toggleItalic"
        icon={<Icon name={'italic'} />}
        onSelect={() => commands.toggleItalic()}
        enabled={true}
      />

      <CommandButton
        icon={<Icon name={'bold'} />}
        commandName="toggleBold"
        onSelect={() => commands.toggleBold()}
        enabled={true}
      />

      <CommandButton
        icon={<Icon name={'bold'} />}
        commandName="toggleBold"
        onSelect={() => commands.toggleBold()}
        enabled={true}
      />

      <CommandButton
        icon={<Icon name={'listUnordered'} />}
        commandName="toggleBulletList"
        active={active.bulletList()}
        onSelect={() => commands.toggleBulletList()}
        enabled={true}
      />
      <CommandButton
        icon={<Icon name={'listOrdered'} />}
        commandName="toggleOrderedList"
        active={active.orderedList()}
        onSelect={() => commands.toggleOrderedList()}
        enabled={true}
      />
      <InsertHorizontalRuleButton />
      <CommandButton
        // onMouseDown={(event) => event.preventDefault()}
        // onClick={() =>
        //   commands.createTable({
        //     rowsCount: 4,
        //     columnsCount: 4,
        //     withHeaderRow: false,
        //   })
        // }
        icon={<Icon name={'table2'} />}
        commandName={'addTable'}
        onSelect={() =>
          commands.createTable({
            rowsCount: 4,
            columnsCount: 3,
            withHeaderRow: true,
          })
        }
        enabled={true}>
        T
      </CommandButton>

      {/* <HeadingMenu />
            <Divider type="vertical" />
            <CommandButton
                icon={<BoldOutlined />}
                commandName="toggleBold"
                active={active.bold()}
                onClick={() => commands.toggleBold()}
            />
            <CommandButton
                icon={<ItalicOutlined />}
                commandName="toggleItalic"
                active={active.italic()}
                onClick={() => commands.toggleItalic()}
            />
            <CommandButton
                icon={<UnderlineOutlined />}
                commandName="toggleUnderline"
                active={active.underline()}
                onClick={() => commands.toggleUnderline()}
            />
            <CommandButton
                icon={<StrikethroughOutlined />}
                commandName="toggleStrike"
                active={active.strike()}
                onClick={() => commands.toggleStrike()}
            />
            <Divider type="vertical" />
            <CommandButton
                icon={<UnorderedListOutlined />}
                commandName="toggleBulletList"
                active={active.bulletList()}
                onClick={() => commands.toggleBulletList()}
            />
            <CommandButton
                icon={<OrderedListOutlined />}
                commandName="toggleOrderedList"
                active={active.orderedList()}
                onClick={() => commands.toggleOrderedList()}
            />
            <Divider type="vertical" />
            <CommandButton
                icon={<CodeIcon />}
                commandName="toggleCode"
                active={active.code()}
                onClick={() => commands.toggleCode()}
            />
            <CommandButton
                icon={<CodeBlockIcon />}
                commandName="toggleCodeBlock"
                active={active.codeBlock()}
                onClick={() => commands.toggleCodeBlock()}
            />
            <Divider type="vertical" />
            <AddImageButton />
            <AddLinkButton /> */}
      {/* <Divider type="vertical" /> */}
      {/* <button>Table</button> */}
    </Flex>
  );
};
