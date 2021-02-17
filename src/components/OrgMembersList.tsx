import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Image } from 'theme-ui';
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
}

const OrgMembersList = ({ id, members }: OrgMembersListProps) => {
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
    <Box py={3} mt={4}>
      {/* <Flex>
        <Link href="/themes/new" icon={<Plus />}>
          <Text>New</Text>
        </Link>
      </Flex> */}
      {parent && (
        <>          
          <Box mx={0} mb={3}>
            <Text mb={3}>All Members</Text>
            <Box>
              {members &&
                members.length > 0 &&
                members.map((_m: Member) => (
                  <Flex variant="plateBox" sx={{ border: 'solid 1px', pl: 4, borderColor: '#ddd', borderRadius: 3 }}>
                    <Box>
                      <Image src={`http://localhost:4000/` + _m.profile_pic} sx={{ width: '40px', height: '40px',mr: 3}}/>
                    </Box>
                    <Box>
                      <Text sx={{ fontWeight: 600}}>{_m.name}</Text>
                      <Text sx={{ fontSize: 0,  color: 'gray.8' }}>
                        {_m.email}
                      </Text>
                    </Box>
                    <Text
                      sx={{
                        fontSize: 0,
                        pl: 3,
                        pt: 1,
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
