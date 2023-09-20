import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Avatar, Button } from 'theme-ui';
import { loadEntity, updateEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

import PageHeader from './PageHeader';
import { Table } from './Table';
import { BoxWrap, StateBadge } from './Atoms';
import ContentLoader from './ContentLoader';

export interface ApprovalList {
  pre_state: State;
  post_state: State;
  instance: Instance;
  approved: boolean;
}

export interface ApprovaSystemItem {
  approval_system_id: string;
  approved_at?: string;
  flag: boolean;
  id: string;
  instance_id: string;
  rejected_at?: string;
}

export interface Instance {
  stete_id: string;
  state: string;
  id: string;
}

export interface State {
  state: string;
  id: string;
}

const Approvals = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // const { addToast } = useToasts();

  const loadDataSuccess = (data: any) => {
    setLoading(true);
    const res: ApprovaSystemItem[] = data.instance_approval_systems;
    setContents(res);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'users/instance-approval-systems', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  const onApproved = () => {
    console.log('onApproved');
  };

  /**
   * Approve an Instance
   */

  const approveInstance = (id: string) => {
    updateEntity(`/contents/${id}/approve`, {}, token, onApproved);
  };

  /**
   * Table Constructor
   */

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col1: (
            <Box
              sx={{
                borderRadius: '4px',
                height: '40px',
                width: '5px',
                border: 'solid 1px',
                borderColor: 'gray.1',
                mr: 0,
                // ml: 2,
                mt: 2,
              }}
            />
          ),
          col2: (
            <BoxWrap
              id={r.instance?.instance_id}
              name={r.instance?.serialized?.title}
              xid={r.instance?.id}
            />
          ),
          col3: (
            <Box pt={1}>
              {r.content?.inserted_at}
              {/* <TimeAgo time={r.content?.inserted_at} /> */}
            </Box>
          ),
          col4: <Avatar mt={2} width="20px" src={r.creator?.profile_pic} />,
          state: <StateBadge name={r.state.state} color="green.3" />,
          status: (
            <Flex sx={{ mr: 1, p: 2 }}>
              <Flex>
                <Box sx={{ mr: 2 }}>
                  <Button variant="btnSecondary" sx={{ mr: 1 }}>
                    Review
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="btnAction"
                    onClick={() => approveInstance(r.instance?.id)}>
                    Approve
                  </Button>
                </Box>
              </Flex>
            </Flex>
          ),
        };

        row.push(rFormated);
      });

      setTableList(row);
    }
  }, [contents]);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.0' }}>
      <PageHeader title="Approvals" desc="All Approvals across your feeds">
        <Box sx={{ ml: 'auto' }}></Box>
      </PageHeader>
      <Flex>
        <Box mx={0} mb={3} variant="layout.pageFrame" sx={{ width: '75%' }}>
          {!loading && <ContentLoader />}
          {loading && !contents && (
            <Box
              sx={{
                p: 4,
                bg: 'gray.0',
                border: 'solid 1px',
                borderColor: 'gray.2',
              }}>
              <Text>Nothing to approve</Text>
            </Box>
          )}
          {loading && contents && (
            <Table
              options={{
                columns: [
                  {
                    Header: '',
                    accessor: 'col1', // accessor is the "key" in the data
                    width: 'auto',
                  },
                  {
                    Header: 'Name',
                    accessor: 'col2',
                    width: '50%',
                  },
                  {
                    Header: 'Time',
                    accessor: 'col3',
                    width: 'auto',
                  },
                  {
                    Header: 'Sent by',
                    accessor: 'col4',
                    width: '10%',
                  },
                  {
                    Header: 'State',
                    accessor: 'state',
                    width: '10%',
                  },
                  {
                    Header: 'Action',
                    accessor: 'status',
                    width: '15%',
                  },
                ],
                data: tableList,
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            bg: 'bgWhite',
            minHeight: '100vh',
            width: '25%',
            borderLeft: 'solid 1px',
            borderColor: 'neutral.1',
          }}></Box>
      </Flex>
    </Box>
  );
};
export default Approvals;
