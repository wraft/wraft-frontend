import styled from "@xstyled/emotion";

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
    background-color: background-primary;
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
        color: text-primary;

        a{
            color: text-primary;
            text-decoration: none;
            font-size: 12px;
            padding: 12px 12px;
        }

        &:last-child{
            margin-right:0px;
        }
        

        &.selected{
            background-color: #E2F7EA;
            color: primary;
            a{
                color: primary;
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
`;
