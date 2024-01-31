import type { Meta, StoryObj } from '@storybook/react';
import * as Icon from '@wraft/icon';

interface Icons {
  [key: string]: any;
}

const icons: Icons = Icon;

export const Icons = () => {
  return (
    <>
      <div style={{display: 'flex', gap:'18px', flexWrap: 'wrap'}}>
        {Object.keys(icons).map(key => {
        const Icon = icons[key]
        return (
          <div key={key} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Icon />
            <div style={{paddingTop: '6px', paddingBottom: '6px'}}>{key}</div>
          </div>
         
        )
      })}
      </div>
    </>
  );
};

const meta: Meta = {
  component: Icon.AddIcon,
};

export default meta;
