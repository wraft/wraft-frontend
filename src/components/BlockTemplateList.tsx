import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';

import Link from './NavLink';
import { loadEntity } from '../utils/models';

import { useTable } from 'react-table';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import { Plus } from '@styled-icons/boxicons-regular';

const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 0px solid #ddd;
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
        background: transparent;
        border-right: 0;
        border-bottom: solid 1px #eee;
      }
    }
    th,
    td {
      margin: 0;
      padding: 24px 16px;
      text-align: left;
      border-bottom: 0;
      border-right: 0;
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
          <Text>
            {props.row.value}
          </Text>
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
    <Box py={3} variant="w100" mt={4} ml={4}>
      <Flex variant="plateLite">
        <Box>
          <Text variant="pageheading">Blocks</Text>
          <Text variant="pageinfo">All Block Templates</Text>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Link
            variant="button"
            href="/block_templates/new"
            icon={<Plus width={20} />}>
            <Text>New Block</Text>
          </Link>
        </Box>
      </Flex>
      <Flex>
        <Box mx={0} mb={3} variant="w100">
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
      </Flex>
    </Box>
  );
};
export default Form;
