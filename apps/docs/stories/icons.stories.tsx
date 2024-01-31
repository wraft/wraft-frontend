import type { Meta, StoryObj } from '@storybook/react';

import * as Icon from '@wraft/icon';

const iconNames = ['Add', 'Up', 'Down'];

export const Icons = () => {
  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', paddingBottom: '20px',gap:'5px'}}>
        <Icon.AddIcon />
        <span>Add</span>
        <Icon.AddPeopleIcon />
        <span>AddPeople</span>
        <Icon.ArrowDownIcon />
        <span>ArrowDown</span>
        <Icon.ArrowLeftIcon />
        <span>ArrowLeft</span>
        <Icon.ArrowRightIcon />
        <span>ArrowRight</span>
        <Icon.ArrowUpIcon />
        <span>ArrowUp</span>
        <Icon.BoldIcon />
        <span>Bold</span>
        <Icon.BulletListIcon />
        <span>BulletList</span>
        <Icon.CloseIcon />
        <span>Close</span>
        <Icon.DeleteIcon />
        <span>Delete</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom:'20px', gap:'7px' }}>
        
        <Icon.DownIcon />
        <span>Down</span>
        <Icon.EditIcon />
        <span>Edit</span>
        <Icon.EllipsisHIcon />
        <span>EllipsisH</span>
        <Icon.EllipsisVIcon />
        <span>EllipsisV</span>
        <Icon.EyeIcon />
        <span>Eye</span>
        <Icon.EyeClosedIcon />
        <span>EyeClosed</span>
        <Icon.FilterIcon />
        <span>Filter</span>
        <Icon.H1Icon />
        <span>H1</span>
        <Icon.H2Icon />
        <span>H2</span>
        <Icon.H3Icon />
        <span>H3</span>
        <Icon.HomeIcon/>
        <span>Home</span>
        <Icon.UpIcon />
        <span>Up</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center',gap:'5px' }}>
        <Icon.ItalicsIcon />
        <span>Italics</span>
        <Icon.LeftIcon />
        <span>Left</span>
        <Icon.NotificationIcon />
        <span>Notification</span>
        <Icon.NotificationOffIcon />
        <span>NotificationOff</span>
        <Icon.PlayIcon />
        <span>Play</span>
        <Icon.RedoIcon />
        <span>Redo</span>
        <Icon.RightIcon />
        <span>Right</span>
        <Icon.SearchIcon />
        <span>Search</span>
        <Icon.SortIcon />
        <span>Sort</span>
        <Icon.TableIcon />
        <span>Table</span>
        <Icon.UnderlineIcon />
        <span>Underline</span>
        <Icon.UndoIcon />
        <span>Undo</span>
        
      </div>
    </>
  );
};

const meta: Meta = {
  component: Icon.AddIcon,
};

export default meta;
