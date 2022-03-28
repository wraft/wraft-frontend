import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Flex, Avatar, Button } from 'theme-ui';
import { loadEntity, updateEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

import PageHeader from './PageHeader';

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
      <Box
        sx={{ width: '30px', height: '30px', bg: 'blue.3', borderRadius: 99 }}
      />
      <Box sx={{ pl: 3 }}>
        <Box sx={{ fontSize: 0, color: '#828282' }}>Doc { props.id}</Box>
        <Text>{props?.instance_id}</Text>
      </Box>
      <Box sx={{ ml: 'auto' }}>
        <Flex>
          <Box sx={{ pr: 4, pt: 1 }}>            
          </Box>
          <Box sx={{ pt: 2, mr: 4 }}>
            <Avatar
              width="20px"
              src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
            />
          </Box>
          <Button variant="btnSecondary"  sx={{ mr: 1 }}>Review</Button>
          <Button variant="btnPrimary" onClick={() => props.onApprove(props.instance_id)}>Approve</Button>
        </Flex>
      </Box>
    </Flex>
  );
};

const Approvals = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  // const { addToast } = useToasts();

  const loadDataSuccess = (data: any) => {
    const res: ApprovaSystemItem[] = data.instances_to_approve;
    setContents(res);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'users/me', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);


  const onApproved = () => {  
    console.log('onApproved')
  }

  /**
   * Approve an Instance
   */

  const approveInstance = (id: string) => {
    updateEntity(`/contents/${id}/approve`, {}, token, onApproved)
  }

  return (
    <Box>
      <PageHeader title="Approvals" desc="All Approvals across your feeds">
        <Box sx={{ ml: 'auto' }}>
        
        </Box>
      </PageHeader>      
      <Box mx={0} mb={3} variant="layout.pageFrame">
        {!contents && (
          <Box sx={{ p: 4, bg: 'gray.0', border: 'solid 1px', borderColor: 'gray.2'}}>
            <Text>Nothing to approve</Text>
          </Box>
        )}
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ContentListCard key={m.id} {...m} onApprove={approveInstance}/>)}
        </Box>
      </Box>
    </Box>
  );
};
export default Approvals;
