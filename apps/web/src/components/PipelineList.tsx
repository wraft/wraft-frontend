import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from 'theme-ui';
import { Drawer } from '@wraft-ui/Drawer';

import { fetchAPI } from '../utils/models';
import Link from './NavLink';
import PageHeader from './PageHeader';
import PipelineTypeForm from './PipelineTypeForm';

export interface Pipelines {
  total_pages: number;
  total_entries: number;
  pipelines: Pipeline[];
  page_number: number;
}

export interface Pipeline {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: string;
  stages: any;
}

const ItemField = (props: any) => {
  // const deletePipeline = (id: string, token: string) => {
  //   deleteEntity(`pipelines/${id}`, token);
  // };

  return (
    <Box
      variant="boxy"
      key={props.id}
      p={3}
      sx={{ bg: '#fff', borderBottom: 'solid 1px #eee', borderRadius: '3px' }}>
      <Link href={`/manage/pipelines/run/${props.id}`}>
        <Text as="h4">{props.name}</Text>
        <Text pt={1} color="grey">
          Desc
        </Text>
      </Link>
    </Box>
  );
};

const Form = () => {
  const [contents, setContents] = useState<Array<Pipeline>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const loadData = () => {
    fetchAPI('pipelines').then((data: any) => {
      const res: Pipeline[] = data.pipelines;
      setContents(res);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  function setRerender(e: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box>
      <PageHeader title="Pipelines">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 1, mt: 0 }}>
          <Button variant="buttonSecondary" onClick={() => setIsOpen(true)}>
            New Pipeline
          </Button>
        </Flex>
      </PageHeader>
      <Box mx={0} mb={3}>
        <Box px={4} my={3}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <ItemField
                key={m.id}
                {...m}
                t="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3cmFmdF9kb2MiLCJleHAiOjE1OTE5MTcwOTQsImlhdCI6MTU4OTQ5Nzg5NCwiaXNzIjoid3JhZnRfZG9jIiwianRpIjoiZjExYTM2ODQtNjMxZi00Yjg0LTliOGEtMmY4OWMzMzlkM2ExIiwibmJmIjoxNTg5NDk3ODkzLCJzdWIiOiJhZG1pbkB3cmFmdGRvY3MuY29tIiwidHlwIjoiYWNjZXNzIn0.Sripy5ul5bW6xy_5ebxdPq4WihBIntde3Aq4kcWDE5gCgZpFpKR22hQtq_Y9ZWT1ARTXecMDxeQ-I7w30IAPLQ"
              />
            ))}
        </Box>
      </Box>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        {isOpen && (
          <PipelineTypeForm setIsOpen={setIsOpen} setRerender={setRerender} />
        )}
      </Drawer>
    </Box>
  );
};
export default Form;
