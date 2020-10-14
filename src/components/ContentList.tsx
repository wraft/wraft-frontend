import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Badge, Image } from 'theme-ui';
import MenuItem from './NavLink';

import { parseISO, formatDistanceToNow } from 'date-fns';

import ReactPaginate from 'react-paginate';

import {
  BoltCircle as Check,
  InfoCircle,
  Phone,
  MailSend,
} from '@styled-icons/boxicons-regular';

import { useStoreState } from 'easy-peasy';
import { loadEntity, deleteEntity } from '../utils/models';
import { Spinner } from 'theme-ui';

const TimeAgo = (time: any) => {
  const timetime = parseISO(time.time);
  const timed = formatDistanceToNow(timetime);
  return (
    <Text pl={2} pt={1} sx={{ fontSize: 0 }} color="gray.6">
      \ {timed}
    </Text>
  );
};

// const ColorPill = styled(Box)`
//   width: 2px;
//   position: absolute;
//   top: 8;
//   left: 0;
//   height: 40px;
//   display: inline-block;
//   border-radius: 0px;
// `;

// const Pill = styled(Box)`
//   border-radius: 1rem;
//   font-size: 7px !important;
//   opacity: 0.7;
//   padding: 4px;
//   display: inline-block;
//   margin-top: 2px;
// `;

// const Block = styled(Box)`
//   border-radius: 3px;
//   padding: 4px;
//   margin-top: 13px !important;
//   border-bottom: solid 1px #ddd;
//   padding-left: 40px;
//   padding-bottom: 24px;
//   position: relative;
// `;

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

export interface IContentType {
  name: string;
  id: string;
  description: string;
  color: string;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface StateClass {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface IField {
  content: IContent;
  content_type: IContentType;
  state: StateClass;
  doDelete: any;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const Tablet = (props: any) => (
  <Badge sx={{ bg: 'transparent', color: 'gray.6', p: 0, pt: 1 }}>
    <Text sx={{ fontWeight: 'body' }}>{props.type}</Text>
  </Badge>
);

const ItemField = (props: IField) => {
  return (
    <Box variant="listWide" key={props.content.instance_id} pb={3} pt={3}>
      <Flex sx={{ position: 'relative' }}>
        <Box variant="cTyeMark" bg={props.content_type.color} />
        <MenuItem
          variant="rel"
          href={`/content/[id]`}
          path={`content/${props.content.id}`}>
          <Text>{props.content.serialized.title}</Text>
        </MenuItem>
        <Box ml="auto" mr={3}>
          {props.state.state === 'Published' && (
            <Check width={16} color="#2b8a3e" />
          )}

          {props.state.state === 'Draft' && (
            <InfoCircle width={16} color="#5c7cfa" />
          )}
          <Text
            pt={1}
            sx={{
              pl: 1,
              fontSize: 0,
              color: 'gray.7',
              display: 'inline-block',
            }}>
            {props.state.state}
          </Text>
          <Flex>{/* props.content_type.name */}</Flex>
        </Box>
      </Flex>
      <Flex>
        <Tablet type={props.content.instance_id} pr={2} />
        <TimeAgo time={props.content.updated_at} />
      </Flex>
    </Box>
  );
};

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const ContentList = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);

  const profile = useStoreState(state => state.profile.profile);

  const loadDataSuccess = (data: IPageMeta) => {
    setLoading(true);
    const res: IField[] = data.contents;
    setContents(res);
    setPageMeta(data);
  };

  const loadData = (token: string) => {
    loadEntity(token, 'contents', loadDataSuccess);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    deleteEntity(`contents/${id}`, token);
  };

  const doDelete = (id: string) => {
    delData(id);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  return (
    <Flex>
      <Box py={3} sx={{ width: '60%', float: 'left' }}>
        <Text variant="pageheading">Documents</Text>
        <Text variant="pagedesc">Documents</Text>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        <Text sx={{ display: 'none' }}>{token}</Text>
        <Box mx={0} mb={3} variant="w100">
          <Box
            sx={{
              border: 'solid 1px #ddd',
              paddingLeft: '0',
              borderRadius: '4px',
              backgroundColor: '#fff',
            }}>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => (
                <ItemField key={m.content.id} doDelete={doDelete} {...m} />
              ))}
          </Box>
        </Box>
        {pageMeta && (
          <ReactPaginate
            pageCount={pageMeta.page_number}
            pageRangeDisplayed={2}
            marginPagesDisplayed={6}
            onPageChange={() => console.log('x')}
            activeClassName={'active'}
          />
        )}
      </Box>
      <Box
        variant="boxCard1"
        sx={{ width: '33%', height: 'auto', ml: 3, mr: 3, mt: 5, p: 4, pb: 5 }}>
        <Flex>
          <Box>
            <Image
              sx={{ borderRadius: 99 }}
              src={`http://localhost:4000/${profile.profile_pic}`}
              width={80}
              height={80}
            />
          </Box>
          <Box>
            <Box sx={{ pl: 3, pt: 2 }}>
              <Text variant="personName">{profile?.name}</Text>
              <Text variant="personBio">CEO</Text>
              <Text variant="personPlace">Functionary Labs, Amsterdam</Text>
            </Box>
          </Box>
        </Flex>
        <Box sx={{ pl: 3, pt: 2}}>
          <Flex
            variant="boxCard1"
            sx={{
              // bg: 'white',
              pt: 2,
              pb: 0,
              borderTop: 'solid 1px #eee',
              mt: 3,
            }}>
            <Phone width={24} height={24} />
            <Text ml={2} mt={1} variant="personBlock">
              +91 7950473500
            </Text>
          </Flex>
          <Flex
            variant="boxCard1"
            sx={{
              // bg: 'white',
              pt: 2,
              pb: 0,
              borderTop: 'solid 1px #eee',
              mt: 2,
            }}>
            <Flex>
              <MailSend width={24} height={24} mr={2} />
              <Text ml={2} mt={1} variant="personBlock">
                {profile?.email}
              </Text>
            </Flex>
          </Flex>
          <Box>
            <Text
              ml={2}
              mt={3}
              sx={{
                textTransform: 'uppercase',
                mb: 2,
                fontSize: 0,
                pt: 3,
                pb: 2,
              }}>
              Recent Documents
            </Text>
            <Flex
              sx={{
                pl: 0,
                borderBottom: 'solid 1px',
                borderColor: 'gray.3',
                alignItems: 'flex-start',
                bg: 'white',
                p: 3,
              }}>
              <Image
                width={40}
                sx={{ borderRadius: 3 }}
                height="auto"
                src="https://logo.clearbit.com/dropbox.com"
              />
              <Box pl={3} pr={3}>
                <Text sx={{ fontSize: 0, color: 'gray.6' }}>Contract</Text>
                <Text sx={{ fontSize: 1, fontWeight: 400, color: 'gray.8' }}>
                  Storage Partner Contract
                </Text>
                <Text sx={{ fontSize: 0 }}>Jan 24</Text>
              </Box>
            </Flex>
            <Flex
              sx={{
                pl: 0,
                borderBottom: 'solid 1px',
                borderColor: 'gray.3',
                alignItems: 'flex-start',
                bg: 'white',
                p: 3,
              }}>
              <Image
                width={40}
                sx={{ borderRadius: 0 }}
                height="auto"
                src="https://logo.clearbit.com/dieture.com"
              />
              <Box pl={3} pr={3}>
                <Text sx={{ fontSize: 0, color: 'gray.6' }}>Proposal</Text>
                <Text sx={{ fontSize: 1, fontWeight: 400, color: 'gray.8' }}>
                  Proposal for Dieture
                </Text>
                <Text sx={{ fontSize: 0 }}>Jan 24</Text>
              </Box>
            </Flex>
            <Flex
              sx={{
                pl: 0,
                borderBottom: 'solid 1px',
                borderColor: 'gray.3',
                alignItems: 'flex-start',
                bg: 'white',
                p: 3,
              }}>
              <Image
                width={40}
                sx={{ borderRadius: 3 }}
                height="auto"
                src="https://logo.clearbit.com/tridz.com"
              />
              <Box pl={3} pr={3}>
                <Text sx={{ fontSize: 0, color: 'gray.6' }}>Contract</Text>
                <Text sx={{ fontSize: 1, fontWeight: 400, color: 'gray.8' }}>
                  Proposal for Drupal Contract Engineer
                </Text>
                <Text sx={{ fontSize: 0 }}>Jan 24</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
export default ContentList;
