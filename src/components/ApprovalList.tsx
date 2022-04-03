import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Flex, Avatar, Button, Badge } from 'theme-ui';
import { loadEntity, updateEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

import PageHeader from './PageHeader';
import { Table } from './Table';
import { TimeAgo, BoxWrap, StateBadge } from './Atoms';

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

/**
 * Content List Card
 * @returns
 */

const ContentListCard: FC = (props: any) => {
  return (
    <Flex
      sx={{
        py: 3,
        mt: 0,
        borderBottom: 'solid 1px',
        borderColor: 'gray.2',
      }}>
      <Box>
        <Avatar
          width="32px"
          height="32px"
          sx={{ mr: 2 }}
          src={props?.creator?.profile_pic}
        />
      </Box>
      <Box sx={{ pl: 3 }}>
        <Box sx={{ fontSize: '12px', color: '#828282' }}>
          {props?.instance?.instance_id} <Badge>{props?.state?.state}</Badge>
        </Box>
        <Text>{props?.instance?.serialized?.title}</Text>
      </Box>
      <Box sx={{ ml: 'auto' }}>
        <Flex>
          <Box sx={{ pr: 4, pt: 1 }}></Box>
          <Flex sx={{ pt: 2, mr: 4 }}>
            <Box>
              <Text>{props?.creator?.name}</Text>
            </Box>
          </Flex>
          <Button variant="btnSecondary" sx={{ mr: 1 }}>
            Review
          </Button>
          <Button
            variant="btnAction"
            onClick={() => props.onApprove(props.instance?.id)}>
            Approve
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

const Approvals = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);

  // const { addToast } = useToasts();

  const loadDataSuccess = (data: any) => {
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
      let row: any = [];
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
          col4: (
            <Avatar
              mt={2}
              width="20px"
              src={r.creator?.profile_pic}
            />
          ),
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
    <Box>
      <PageHeader title="Approvals" desc="All Approvals across your feeds">
        <Box sx={{ ml: 'auto' }}></Box>
      </PageHeader>
      <Flex>
        <Box mx={0} mb={3} variant="layout.pageFrame" sx={{ width: '75%' }}>
          {!contents && (
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
          {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => (
                <ContentListCard key={m.id} {...m} onApprove={approveInstance} />
              ))}
          </Box> */}
        </Box>
        <Box
          sx={{
            bg: 'gray.1',
            minHeight: '100vh',
            width: '25%',
            borderLeft: 'solid 1px',
            borderColor: 'gray.3',
          }}></Box>
      </Flex>
    </Box>
  );
};
export default Approvals;
