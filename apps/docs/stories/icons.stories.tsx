import type { Meta, StoryObj } from '@storybook/react';

import * as Icon from '@wraft/icon';

const iconNames = ['Add', 'Up', 'Down'];

export const Icons = () => {
  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', paddingBottom: '20px',gap:'5px'}}>
        <Icon.Add />
        <span>Add</span>
        <Icon.AddPeople />
        <span>AddPeople</span>
        <Icon.ArrowDown />
        <span>ArrowDown</span>
        <Icon.ArrowLeft />
        <span>ArrowLeft</span>
        <Icon.ArrowRight />
        <span>ArrowRight</span>
        <Icon.ArrowUp />
        <span>ArrowUp</span>
        <Icon.Bold />
        <span>Bold</span>
        <Icon.BulletList />
        <span>BulletList</span>
        <Icon.Close />
        <span>Close</span>
        <Icon.Delete />
        <span>Delete</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom:'20px', gap:'7px' }}>
        
        <Icon.Down />
        <span>Down</span>
        <Icon.Edit />
        <span>Edit</span>
        <Icon.EllipsisH />
        <span>EllipsisH</span>
        <Icon.EllipsisV />
        <span>EllipsisV</span>
        <Icon.Eye />
        <span>Eye</span>
        <Icon.EyeClosed />
        <span>EyeClosed</span>
        <Icon.Filter />
        <span>Filter</span>
        <Icon.H1 />
        <span>H1</span>
        <Icon.H2 />
        <span>H2</span>
        <Icon.H3 />
        <span>H3</span>
        <Icon.Home/>
        <span>Home</span>
        <Icon.Up/>
        <span>Up</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center',gap:'5px' }}>
        <Icon.Italics />
        <span>Italics</span>
        <Icon.Left />
        <span>Left</span>
        <Icon.Notification />
        <span>Notification</span>
        <Icon.NotificationOff />
        <span>NotificationOff</span>
        <Icon.Play />
        <span>Play</span>
        <Icon.Redo />
        <span>Redo</span>
        <Icon.Right />
        <span>Right</span>
        <Icon.Search />
        <span>Search</span>
        <Icon.Sort />
        <span>Sort</span>
        <Icon.Table />
        <span>Table</span>
        <Icon.Underline />
        <span>Underline</span>
        <Icon.Undo/>
        <span>Undo</span>
        
      </div>
    </>
  );
};

const meta: Meta = {
  component: Icon.Add,
};

export default meta;
