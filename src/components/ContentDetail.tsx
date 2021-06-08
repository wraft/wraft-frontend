import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Link, Button } from 'theme-ui';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { File } from './Icons';
import { MarkdownEditor } from './WraftEditor';
import CommentForm from './CommentForm';

import { parseISO, formatDistanceStrict } from 'date-fns';

import { Pencil, Download } from '@styled-icons/boxicons-regular';

import {
  createEntity,
  loadEntity,
  deleteEntity,
  API_HOST,
} from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { Spinner } from 'theme-ui';
import MenuItem from './MenuItem';

const PreTag = styled(Box)`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

export interface ContentInstance {
  state: State;
  creator: Creator;
  content_type: ContentType;
  content: Content;
}

export interface Content {
  updated_at: Date;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: Date;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  body: string;
  serialized: any;
}

export interface ContentType {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  fields: Fields;
  description: string;
}

export interface Fields {
  position: string;
  name: string;
  joining_date: string;
  approved_by: string;
}

export interface Creator {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface State {
  updated_at: Date;
  state: string;
  order: number;
  inserted_at: Date;
  id: string;
}

export interface IBuild {
  updated_at: string;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: string;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  serialized: any;
  body: string;
}

export const TimeAgo = (time: any) => {
  const timetime = parseISO(time.time);
  const nw = Date.now();
  const timed = formatDistanceStrict(timetime, nw, { addSuffix: true });

  let timed1 = timed.replace(' hours ago', 'h');
  timed1 = timed1.replace(' days ago', 'd');
  timed1 = timed1.replace(' years ago', 'y');

  return (
    <Text
      pl={0}
      pt="3px"
      sx={{
        fontSize: 0,
        '.hov': { opacity: 0 },
        ':hover': { '.hov': { opacity: 1 } },
      }}
      color="gray.6">
      {timed1}
    </Text>
  );
};

const ContentDetail = () => {
  const token = useStoreState((state) => state.auth.token);

  const router = useRouter();
  const cId: string = router.query.id as string;
  const [contents, setContents] = useState<ContentInstance>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBody, setContentBody] = useState<any>();
  const [build, setBuild] = useState<IBuild>();

  const loadDataSucces = (data: any) => {
    setLoading(false);
    const res: ContentInstance = data;
    setContents(res);
  };

  const loadData = (t: string, id: string) => {
    loadEntity(t, `contents/${id}`, loadDataSucces);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    if (token) {
      deleteEntity(`contents/${id}`, token);
    }
  };

  /**
   * On Build success
   * @param data
   */
  const onBuild = (data: any) => {
    setLoading(false);
    setBuild(data);
    if (token) {
      loadData(token, cId);
    }
  };

  /**
   * Pass for build
   */
  const doBuild = () => {
    console.log('Building');
    setLoading(true);
    createEntity([], `contents/${cId}/build`, token, onBuild);
  };

  useEffect(() => {
    if (token) {
      loadData(token, cId);
    }
  }, [token]);

  useEffect(() => {
    console.log('contentBody', contentBody);
  }, [contentBody]);

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const contentBodyAct = contents.content.serialized;

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);
        console.log('contentBodyAct2', contentBodyAct2);
        setContentBody(contentBodyAct2);
      }
    }
  }, [contents]);

  const doUpdate = () => {
    //
  };

  return (
    <Box py={3}>
      <Box sx={{ position: 'relative', pl: 4, pt: 2 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-50%',
              left: '50%',
              top: '80px',
            }}>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {contents && contents.content && (
          <Flex>
            <Box
              sx={{
                width: '65%',
                bg: 'gray.0',
                // fontFamily: 'courier',
                // border: 'solid 0.5px #ddd',
                // borderRadius: 5,
                overflow: 'hidden',
              }}>
              <Flex
                sx={{
                  px: 4,
                  py: 4,
                  pl: '115px',
                  // border: 'solid 1px',
                  // borderColor: 'gray.3',
                }}>
                <Box>
                  <Text sx={{ fontSize: 3 }}>
                    {contents.content.serialized.title}
                  </Text>
                  {/* <Text
                  sx={{
                    fontSize: 0,
                    color: 'gray.6',
                  }}>{`Updated ${contents.content.inserted_at}`}</Text> */}
                  <Box
                    sx={{
                      // pt: 1,
                      // pl: 2,
                      fontSize: 0,
                      color: 'gray.6',
                    }}>
                    <TimeAgo time={contents.content.inserted_at} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    pt: 1,
                    pl: 2,
                    fontSize: 0,
                    ml: 'auto',
                    color: 'gray.6',
                  }}>
                  <MenuItem
                    variant="btnPrimary"
                    href={`/content/edit/[id]`}
                    path={`/content/edit/${contents.content.id}`}>
                    <Pencil size={20} color="primary" />
                  </MenuItem>
                </Box>
              </Flex>
              <PreTag pt={0}>
                {contentBody && (
                  <MarkdownEditor
                    hideToolbar={false}
                    editable={false}
                    value={contentBody}
                    onUpdate={doUpdate}
                    initialValue={contentBody}
                    cleanInsert={true}
                    editor="wysiwyg"
                  />
                )}
                {/* <Text fontSize={1}>{contents.content.raw}</Text> */}
              </PreTag>
            </Box>
            <Box variant="plateSide" sx={{ pl: 4, flexGrow: 1, mr: 4 }}>
              <Box>
                {build && (
                  <Box>
                    <Text>Updated At</Text>
                    <Text>{build.inserted_at}</Text>
                  </Box>
                )}
                <Box sx={{ pb: 2 }}></Box>
                {contents.content.build && (
                  <Flex pt={3}>
                    <File />
                    <Box>
                      <Box>
                        <Text
                          as="h3"
                          sx={{ fontSize: 1, mb: 0, color: 'gray.8' }}>
                          {contents.content.instance_id}
                        </Text>
                        <Text
                          as="h4"
                          sx={{ fontSize: 0, mb: 0, color: 'gray.6' }}>
                          {contents.state?.state}
                        </Text>
                      </Box>
                    </Box>
                    <Link
                      variant="download"
                      href={`${API_HOST}/${contents.content.build}`}
                      target="_blank">
                      <Box
                        sx={{
                          p: 2,
                          pt: 1,
                          bg: 'green.8',
                          borderRadius: 4,
                          ml: 4,
                        }}>
                        <Download size={20} color="white" />
                      </Box>
                    </Link>
                  </Flex>
                )}
              </Box>
              <Flex
                sx={{
                  pt: 4,
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  flexDirection: 'row',
                  // border: 'solid 1px #ddd',
                }}>
                <Button variant="btnPrimary" onClick={() => doBuild()}>
                  <>
                    {loading && <Spinner color="white" size={24} />}
                    {!loading && <Text>Publish</Text>}
                  </>
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="btnSecondary"
                  onClick={() => delData(contents.content.id)}>
                    <Text>Delete</Text>
                  {/* <Trash size={20} /> */}
                </Button>
              </Flex>

              {contents && contents.content && (
                <Box mt={3}>
                  <Text
                    variant="blockTitle"
                    sx={{
                      pt: 2,
                      pb: 3,
                      textTransform: 'uppercase',
                      fontSize: 0,
                      color: 'gray.7',
                    }}>
                    Comments
                  </Text>
                  <CommentForm
                    master={contents.content_type.id}
                    master_id={contents.content.id}
                  />
                </Box>
              )}
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default ContentDetail;
