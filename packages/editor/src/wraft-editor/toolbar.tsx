import {
  CommandButton,
  HeadingLevelButtonGroup,
  Icon,
  InsertHorizontalRuleButton,
  ToggleBlockquoteButton,
  useActive,
  useCommands,
} from '@remirror/react';

import { Flex } from 'theme-ui';

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
      {/* <InsertHorizontalRuleButton /> */}
      <CommandButton
        icon={<Icon name={'table2'} />}
        commandName={'addTable'}
        onSelect={() =>
          commands.createTable({
            rowsCount: 4,
            columnsCount: 3,
            withHeaderRow: true,
          })
        }
        enabled={true}
      />
    </Flex>
  );
};
