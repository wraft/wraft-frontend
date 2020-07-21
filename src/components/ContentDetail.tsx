import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button } from 'rebass';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { File } from './Icons';
import { MarkdownEditor } from './WraftEditor';
import CommentForm from './CommentForm';
import MenuItem from './MenuItem';

import { Pulse } from 'styled-spinkit';
import { createEntity, loadEntity, deleteEntity, API_HOST } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { Spinner } from 'theme-ui';

const PreTag = styled(Box)`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

const RightBar = styled(Box)`
  position: absolute;
  right: 0;
  width: 320px;
  border-left: solid 1px #eee;
  top: 69px;
  bottom: 0;
  background: #fff;
`;

// const BgGif = styled(Box)`
//   background-image: url(https://i.giphy.com/media/1yT902UqU5fcFxjLbH/200w.webp);
//   height: 100%;
// `

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

// Generated by https://quicktype.io

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

const Form = () => {
  const token = useStoreState(state => state.auth.token);

  const router = useRouter();
  const cId: string = router.query.id as string;
  const [contents, setContents] = useState<ContentInstance>();
  const [loading, setLoading] = useState<boolean>(false);
  const [contentBody, setContentBody] = useState<any>();

  const [build, setBuild] = useState<IBuild>();

  const loadDataSucces = (data: any) => {
    setLoading(true);
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
  }

  /**
   * Pass for build
   */
  const doBuild = () => {
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
    <Box py={3} width={1} mt={4}>
      <Box mx={0} mb={3} width={1}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {contents && contents.content && (
          <Flex>
            {/* { console.log('contents.content', contents.content.serialized.serialized)} */}
            <Box width={7 / 12}>
              <Box pb={3}>
                <Text mb={2} fontSize={2}>
                  {contents.content.serialized.title}
                </Text>
                <Text
                  pt={2}
                  fontSize={
                    0
                  }>{`Created at ${contents.content.inserted_at}`}</Text>
              </Box>
              <PreTag pt={4}>
                {contentBody && (
                  <MarkdownEditor
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
            <RightBar width={3 / 12} p={4}>
              {/* {loading && <Pulse size={12} color="#000"/>}               */}
              <Box variant="bordered">
                {build && (
                  <Box>
                    <Text fontSize={0}>Updated At</Text>
                    <Text>{build.inserted_at}</Text>
                  </Box>
                )}
                <Text mb={2}>{contents.content.instance_id}</Text>
                <Text fontSize={0} fontWeight={400}>
                  {contents.content.id}
                </Text>
                {contents.content.build && (
                  <Flex pt={3}>
                    <File />
                    <Box>
                      <Text pt={0} fontSize={0} pb={1}>
                        {contents.content.instance_id}
                      </Text>
                      <a
                        href={`${API_HOST}/${contents.content.build}`}
                        target="_blank">
                        <Text pt={0} fontWeight={500}>
                          Download
                        </Text>
                      </a>
                    </Box>
                  </Flex>
                )}
              </Box>
              <Flex>
                <Button
                  variant={loading ? 'primary' : 'secondary'}
                  onClick={doBuild}>
                  <Flex>
                    {loading && <Pulse size={8} color="#000" />}
                    Build Now
                  </Flex>
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant={loading ? 'primary' : 'secondary'}
                  onClick={() => delData(contents.content.id)}>
                  Delete
                </Button>
                <MenuItem
                  href={`/content/edit/[id]`}
                  path={`/content/edit/${contents.content.id}`}>
                  Edit
                </MenuItem>
              </Flex>

              {contents && contents.content && (
                <Box mt={3}>
                  <Text fontSize={1} fontWeight={500}>
                    Comments
                  </Text>
                  <CommentForm
                    master={contents.content_type.id}
                    master_id={contents.content.id}
                  />
                </Box>
              )}
            </RightBar>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default Form;
