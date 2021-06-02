import React, { useEffect, useState } from 'react';
import { Button, Box, Text, Flex, Image } from 'theme-ui';
import { Member } from './OrgMemberForm';

export interface Theme {
  total_pages: number;
  total_entries: number;
  themes: ThemeElement[];
  page_number: number;
}

export interface ThemeElement {
  updated_at: string;
  typescale: any;
  name: string;
  inserted_at: string;
  id: string;
  font: string;
  file: null;
}

// const ItemField = (props: any) => {
//   return (
//     <Box
//       variant="boxy"
//       key={props.id}
//       p={3}
//       sx={{ bg: '#fff', borderBottom: 'solid 1px #eee', borderRadius: '3px' }}>
//       <Text>
//         {props.name}
//       </Text>
//       <Text pt={1} color="grey">
//         Sample Field Description
//       </Text>
//       <Button onClick={() => props.onDelete(props.id)}>Delete</Button>
//     </Box>
//   );
// };

interface OrgMembersListProps {
  id: string;
  members?: any;
  onInitInvite?: any;
}

const OrgMembersList = ({ id, members, onInitInvite }: OrgMembersListProps) => {
  // const token = useStoreState(state => state.auth.token);
  // const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [parent, setParent] = useState<any | undefined>();
  // const { addToast } = useToasts();

  // const loadDataSuccess = (data: any) => {
  //   const res: ThemeElement[] = data;
  //   setContents(res);
  // };

  // const onDelete = (id: string) => {
  //   deleteEntity(`themes/${id}`, token);
  //   addToast('Deleted Theme', { appearance: 'success' });
  // };

  useEffect(() => {
    if (id) {
      setParent(id);
    }
  }, [id]);

  // useEffect(() => {
  //   if (token && parent) {
  //     loadData(parent, token);
  //   }
  // }, [token, parent]);

  return (
    <Box>
      {/* <Flex>
        <Link href="/themes/new" icon={<Plus />}>
          <Text>New</Text>
        </Link>
      </Flex> */}
      {parent && (
        <>          
          <Box mx={0} mb={3}>
            <Flex mb={4}>
              <Box>
                <Text as="h2" sx={{ pt: 0, mb: 3, fontSize: 2, pb: 1}}>Members</Text>
              </Box>
              <Box sx={{ ml: 'auto'}}>
                <Button variant="btnSecondary" onClick={() => onInitInvite()} sx={{ pt: 1, pb: 1}}>+ Invite</Button>
              </Box>
            </Flex>
            <Box>
              {members &&
                members.length > 0 &&
                members.map((_m: Member) => (
                  <Flex variant="plateBox" sx={{ border: 'solid 1px', pl: 4, pr: 4, borderColor: '#ddd', borderRadius: 3 }}>
                    <Box pt={3}>
                      <Image src={`http://localhost:4000/` + _m.profile_pic} sx={{ borderRadius: "99rem", width: '40px', height: '40px',mr: 3}}/>
                    </Box>
                    <Box sx={{ pt: 3, pb: 3 }}>
                      <Text as="h4" sx={{ fontWeight: 600}}>{_m.name}</Text>
                      <Text as="p" sx={{ fontSize: 1,  color: 'gray.6' }}>
                        {_m.email}
                      </Text>
                    </Box>
                    <Text
                      sx={{
                        fontSize: 0,
                        pl: 3,
                        pt: 3,
                        ml: 2,
                        color: 'blue.5',
                        ml: 'auto',
                        textTransform: 'uppercase',
                      }}>
                      {_m.role}
                    </Text>
                  </Flex>
                ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
export default OrgMembersList;
