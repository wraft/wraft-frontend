import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { DeleteIcon } from '@wraft/icon';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';
import { Button, Table, Drawer, useDrawer } from '@wraft/ui';
import toast from 'react-hot-toast';

import { deleteAPI, fetchAPI } from '../../utils/models';
import { StateBadge } from '../Atoms';
import PipelineTypeForm from './PipelineTypeForm';
import Modal from '../Modal';
import { ConfirmDelete } from '../common';

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

type Props = {
  rerender: any;
  setRerender: any;
};

const Form = ({ rerender, setRerender }: Props) => {
  const { theme } = useThemeUI();
  const [loading, setLoading] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<any>();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [pipeStageName, setPipeStageName] = useState<string>('');
  const [pipelineStageTemplateId, setPipelineStageTemplateId] =
    useState<string>('');
  const [selectedPipelineStageId, setSelectedPipelineStageId] =
    useState<string>('');

  const mobileMenuDrawer = useDrawer();

  const handlePipelineClick = (
    pipelineStageId: string,
    stagename: string,
    pipelineStageTemplateId: string,
  ) => {
    setShowSearch(!showSearch);
    setSelectedPipelineStageId(pipelineStageId);
    setPipeStageName(stagename);
    setPipelineStageTemplateId(pipelineStageTemplateId);
  };

  const router = useRouter();

  const cId: string = router.query.id as string;

  const loadDetails = () => {
    fetchAPI(`pipelines/${cId}`).then((data: any) => {
      setPipelineData(data);
    });
  };

  const handleAddPipelineStep = () => {
    setShowSearch(true);
    // Reset selectedPipelineId to empty string when "Add pipeline step" button is clicked
    setSelectedPipelineStageId('');
  };

  const onDelete = (stageId: any) => {
    deleteAPI(`stages/${stageId}`)
      .then(() => {
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Stage Deleted Successfully', { duration: 1000 });
        Router.push(`/manage/pipelines/run/${cId}`);
      })
      .catch(() => {
        toast.error('Delete Failed', { duration: 1000 });
      });
  };

  useEffect(() => {
    loadDetails();
  }, [cId, rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box sx={{ display: 'flex' }} key={row.index}>
          <Text as="p" variant="pM">
            {row.original.data_template?.title}
          </Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.status',
      header: (
        <Flex sx={{ display: 'flex', justifyContent: 'center' }}>
          CONFIGURATION
        </Flex>
      ),
      cell: ({ row }: any) => (
        <Flex
          key={row.index}
          sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            <StateBadge
              name={
                row.original.form_mapping != null ? 'Complete' : 'Incomplete'
              }
              color={
                row.original.form_mapping != null ? 'green.a400' : 'red.200'
              }
            />
          </Box>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.state',
      // header: (
      //   <Flex sx={{ display: 'flex' }}>
      //     <Text as="p" variant="pM" sx={{ color: 'gray.900' }}>
      //       STATE
      //     </Text>
      //   </Flex>
      // ),
      cell: ({ row }: any) => (
        <Flex key={row.index} sx={{ justifyContent: 'end' }}>
          {/* <Text as="p" variant="pM" sx={{ color: 'gray.900' }}>
            Published
          </Text> */}
          <Flex sx={{ alignItems: 'center', gap: 1 }}>
            <Button
              variant="secondary"
              onClick={() =>
                handlePipelineClick(
                  row.original.id,
                  row.original.data_template.title,
                  row.original.data_template.id,
                )
              }>
              Edit
            </Button>
            <DeleteIcon
              cursor="pointer"
              onClick={() => {
                setIsOpenDelete(true);
                setSelectedPipelineStageId(row.original.id);
              }}
            />
          </Flex>
        </Flex>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box>
      {pipelineData?.stages && (
        <Table
          data={pipelineData.stages}
          columns={columns}
          isLoading={loading}
        />
      )}{' '}
      <Box mt="auto" mb="4">
        <Box className="first-step" py={4}>
          <Button variant="secondary" onClick={handleAddPipelineStep}>
            + Add pipeline step
          </Button>
        </Box>
      </Box>
      <Drawer open={showSearch} store={mobileMenuDrawer} withBackdrop={true}>
        {showSearch && (
          <PipelineTypeForm
            setIsOpen={setShowSearch}
            setRerender={setRerender}
            pipelineData={pipelineData}
            selectedPipelineStageId={selectedPipelineStageId}
            pipeStageName={pipeStageName}
            pipelineStageTemplateId={pipelineStageTemplateId}
          />
        )}
      </Drawer>
      <Modal isOpen={isOpenDelete}>
        {
          <ConfirmDelete
            title="Delete Stage"
            text="Are you sure you want to delete ?"
            setOpen={setIsOpenDelete}
            onConfirmDelete={() => {
              onDelete(selectedPipelineStageId);
              setIsOpenDelete(false);
            }}
          />
        }
      </Modal>
    </Box>
  );
};
export default Form;
