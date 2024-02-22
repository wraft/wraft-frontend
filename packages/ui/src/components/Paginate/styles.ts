import styled, { th, x, css, right, useUp, up } from '@xstyled/emotion';


export const Pagination: any = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ul {
    display: inline-block;
    padding-left: 0px;
    padding-right: 0px;
    margin: 0px;
    background-color: backgroundWhite;
    border: 1px solid;
    border-color: border;
    padding: 10px 0px;

    li {
        display: inline-block;
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
        padding: 6px 12px;
        cursor: pointer;

        a{
            color:black;
            text-decoration: none;
            font-size: 12px;
            padding: 12px 12px;
        }

        &:last-child{
            margin-right:0px;
        }
        

        &.selected{
            background-color: #E2F7EA;
            ;
            a{
                color: #004A0F;
            }
        }

        &.break{
            background-color: transparent;
        }

        &.next,
        &.previous{
            padding: 0px 12px;
        }

        &.disabled{
          cursor: auto !important;
          color: #D7DDE9;
            
        }
    }
`