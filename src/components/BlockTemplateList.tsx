import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'rebass';

import Link from './NavLink';
import { loadEntity } from '../utils/models';

import { useTable } from 'react-table';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
// import ReactTable from 'react-table'

const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid #ddd;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    thead {
      th {
        padding-top: 16px;
        padding-bottom: 16px;
        background: #efefef;
        border-right: 1px solid #ddd;
      }
    }
    th,
    td {
      margin: 0;
      padding: 24px 16px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #eee;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  title: string;
  body: string;
  serialized: string;  
}

export interface IFieldItem {
  name: string;
  type: string;
}

// const ItemField = (props: any) => {
//   return (
//     <Box pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee' }}>
//       <Link href={`/templates/edit/${props.id}`}>
//         <Text fontSize={1}>{props.title}</Text>
//       </Link>
//     </Box>
//   );
// };

function Table({ columns, data }: { columns: any; data: any }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // return (<h1>Table</h1>)
  // Render the UI for your table
  return (
    <div>      
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            console.log('row', row);
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// interface Title  {
//   title: string;
// }

interface cellPro {
  title: string;
}

const Title = (props: any) => {
  const {
    row: { cell },
  } = props;
  const org = cell.row.original ? cell.row.original : false;
  return (
    <Box>
      {org && (
        <Link href={`/block_templates/edit/${org.id}`}>
          <Text fontSize={1} fontWeight={500}>{props.row.value}</Text>
        </Link>
      )}
    </Box>
  );
};

const Form = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'title',
        Cell: (row: cellPro) => <Title row={row} />,
      },
      {
        Header: 'Id',
        accessor: 'id',
      },
    ],
    [],
  );

  const loadDataSuccess = (data: any) => {
    const res: IField[] = data.block_templates;
    setContents(res);
  };

  const loadData = () => {
    loadEntity(token, 'block_templates', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData();
    }    
  }, [token]);

  return (
    <Box py={3} width={1} mt={4} ml={4} bg="#eee">
      <Text fontSize={3} mb={2}>Blocks</Text>
      <Text fontSize={1} mb={4}>
        All Block Templates
      </Text>
      <Flex>
        <Box mx={0} mb={3} width={1}>
          <Styles>
            {contents && contents.length > 0 && (
              <Table columns={columns} data={contents} />
            )}
          </Styles>

          {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => <ItemField key={m.id} {...m} />)}
          </Box> */}
        </Box>
        <Link href="/block_templates/new" variant="primary">
          <a>New Block Templates</a>
        </Link>
      </Flex>
    </Box>
  );
};
export default Form;
