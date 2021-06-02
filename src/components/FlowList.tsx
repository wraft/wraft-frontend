import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Spinner } from 'theme-ui';
import MenuItem from './NavLink';
import { fetchAPI } from '../utils/models';
import Paginate, { IPageMeta } from './Paginate';

import { Table } from './Table';
// import { Table } from '@plateui/ui-react';

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

export interface IFlow {
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface ICreator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface IField {
  flow: IFlow;
  creator: ICreator;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const ItemField: FC<any> = ({ flow }) => {
  return (
    <Box key={flow.id} pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee' }}>
      <MenuItem href={`/flows/edit/[id]`} path={`/flows/edit/${flow.id}`}>
        <Box>
          <Text as="h4">{flow.name}</Text>
          <Text sx={{ fontSize: 0}} color="gray.6">{flow.id}</Text>
        </Box>
      </MenuItem>
    </Box>
  );
};

const Form: FC = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [flows, setFlows] = useState<Array<any>>([]);

  const loadData = (page: number) => {
    const pageNo = page > 0 ? `?page=${page}` : '';
    fetchAPI(`flows${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.flows;
        setTotal(data.total_pages);
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const changePage = (_e: any) => {
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    loadData(page);
  }, []);

  useEffect(() => {
    if (contents && contents.length > 0) {
      let row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col1: <Text>~</Text>,
          col2: <ItemField {...r}/>,
          col3: <Box>{r.flow.updated_at}</Box>,
        };

        row.push(rFormated);
      });

      setFlows(row);
    }
  }, [contents]);

  return (
    <Box py={3} mt={4} variant="layout.pageFrame">
      <Text variant="pagetitle">Flows</Text>
      <Box mx={0} mb={3}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {/* <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.flow.id} {...m} />)}
        </Box> */}

        <Box variant="layout.pageFrame">
          <Box mx={0} mb={3}>
            {flows && (
              <Table
                options={{
                  columns: [
                    {
                      Header: 'Id',
                      accessor: 'col1', // accessor is the "key" in the data
                      width: '15%',
                    },
                    {
                      Header: 'Name',
                      accessor: 'col2',
                      width: '45%',
                    },
                    {
                      Header: 'Updated',
                      accessor: 'col3',
                      width: '40%',
                    },
                  ],
                  data: flows,
                }}
              />
            )}
            {/* <Styles>
            {contents && contents.length > 0 && (
              <Table columns={columns} data={contents} />
            )}
          </Styles> */}

            {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => <ItemField key={m.id} {...m} />)}
          </Box> */}
          </Box>
        </Box>
        <Paginate changePage={changePage} {...pageMeta} />
      </Box>
    </Box>
  );
};
export default Form;
