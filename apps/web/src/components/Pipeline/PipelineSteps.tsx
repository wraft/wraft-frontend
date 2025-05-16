import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Drawer,
  useDrawer,
  Modal,
} from '@wraft/ui';
import toast from 'react-hot-toast';
import { Pencil, Trash } from '@phosphor-icons/react';

import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI, fetchAPI } from 'utils/models';
import { sanitizeId, validateResponse } from 'utils/security';
import { usePermission } from 'utils/permissions';

import PipelineStageForm from './PipelineStageForm';

// Define proper interfaces for the pipeline data
interface PipelineStage {
  id: string;
  data_template: {
    id: string;
    title: string;
  };
  form_mapping: Record<string, unknown> | null;
}

interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

interface TableRow {
  index: number;
  original: PipelineStage;
}

interface TableColumn {
  id: string;
  header?: string;
  accessorKey?: string;
  cell: (props: { row: TableRow }) => React.ReactNode;
  enableSorting: boolean;
}

interface PipelineStepsProps {
  rerender: boolean;
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

const PipelineSteps: React.FC<PipelineStepsProps> = ({
  rerender,
  setRerender,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<Pipeline | null>(null);
  const [isStageFormOpen, setIsStageFormOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedStageName, setSelectedStageName] = useState<string>('');
  const [selectedStageTemplateId, setSelectedStageTemplateId] =
    useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');

  const stageFormDrawer = useDrawer();
  const router = useRouter();
  const pipelineId = router.query.id as string;
  const { hasPermission } = usePermission();

  const fetchPipelineDetails = async (): Promise<void> => {
    if (!pipelineId) return;

    const sanitizedId = sanitizeId(pipelineId);
    if (!sanitizedId) {
      toast.error('Invalid pipeline ID', { duration: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAPI(`pipelines/${sanitizedId}`);

      if (!validateResponse(data, ['id', 'name', 'stages'])) {
        throw new Error('Invalid response structure');
      }

      setPipelineData(data as Pipeline);
    } catch (error) {
      toast.error('Failed to load pipeline details', { duration: 3000 });
      console.error('Error fetching pipeline details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStage = (
    stageId: string,
    stageName: string,
    stageTemplateId: string,
  ): void => {
    if (!hasPermission) {
      toast.error('You do not have permission to edit stages', {
        duration: 3000,
      });
      return;
    }

    const sanitizedStageId = sanitizeId(stageId);
    if (!sanitizedStageId) {
      toast.error('Invalid stage ID', { duration: 3000 });
      return;
    }

    setSelectedStageId(sanitizedStageId);
    setSelectedStageName(stageName.trim());
    setSelectedStageTemplateId(sanitizeId(stageTemplateId) || '');
    setIsStageFormOpen(true);
  };

  const handleAddStage = (): void => {
    if (!hasPermission('pipeline', 'manage')) {
      toast.error('You do not have permission to add stages', {
        duration: 3000,
      });
      return;
    }

    setSelectedStageId('');
    setSelectedStageName('');
    setSelectedStageTemplateId('');
    setIsStageFormOpen(true);
  };

  const handleDeleteStage = async (stageId: string): Promise<void> => {
    if (!hasPermission('pipeline', 'manage')) {
      toast.error('You do not have permission to delete stages', {
        duration: 3000,
      });
      return;
    }

    const sanitizedStageId = sanitizeId(stageId);
    if (!sanitizedStageId) {
      toast.error('Invalid stage ID', { duration: 3000 });
      return;
    }

    try {
      await deleteAPI(`stages/${sanitizedStageId}`);
      setRerender((prev) => !prev);
      toast.success('Stage deleted successfully', { duration: 2000 });

      const sanitizedPipelineId = sanitizeId(pipelineId);
      if (sanitizedPipelineId) {
        router.push(`/pipelines/run/${sanitizedPipelineId}`);
      } else {
        router.push('/pipelines');
      }
    } catch (error) {
      toast.error('Failed to delete stage');
    }
  };
  useEffect(() => {
    if (pipelineId) {
      fetchPipelineDetails();
    }
  }, [pipelineId, rerender]);

  const tableColumns: TableColumn[] = [
    {
      id: 'name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }) => (
        <Box display="flex" key={row.index}>
          <Text>{row.original.data_template?.title || 'Unnamed'}</Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'configuration',
      header: 'CONFIGURATION',
      cell: ({ row }) => {
        const isConfigComplete = row.original.form_mapping != null;
        return (
          <Box
            key={row.index}
            display="inline-flex"
            px="sm"
            borderRadius="sm"
            bg={isConfigComplete ? 'primary' : '#ffcc02'}>
            <Text fontSize="sm" color="white">
              {isConfigComplete ? 'Complete' : 'Incomplete'}
            </Text>
          </Box>
        );
      },
      enableSorting: false,
    },

    {
      id: 'actions',
      cell: ({ row }: any) => (
        <Flex key={row.index} justify="flex-end">
          <Flex align="center" gap={1}>
            <Button
              variant="ghost"
              onClick={() =>
                handleEditStage(
                  row.original.id,
                  row.original.data_template?.title || '',
                  row.original.data_template?.id || '',
                )
              }>
              {hasPermission('pipeline', 'manage') && <Pencil size={18} />}
            </Button>
            {hasPermission('pipeline', 'delete') && (
              <Trash
                size={20}
                cursor="pointer"
                onClick={() => {
                  setSelectedStageId(row.original.id);
                  setIsDeleteModalOpen(true);
                }}
              />
            )}
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
          columns={tableColumns}
          isLoading={isLoading}
        />
      )}
      <Box marginTop="auto" marginBottom="4">
        <Box paddingTop={4} paddingBottom={4}>
          {hasPermission('pipeline', 'manage') && (
            <Button variant="secondary" onClick={handleAddStage}>
              + Add pipeline step
            </Button>
          )}
        </Box>
      </Box>
      <Drawer
        open={isStageFormOpen}
        store={stageFormDrawer}
        withBackdrop={true}>
        {isStageFormOpen && (
          <PipelineStageForm
            setIsOpen={setIsStageFormOpen}
            setRerender={setRerender}
            pipelineData={pipelineData}
            selectedPipelineStageId={selectedStageId}
            pipeStageName={selectedStageName}
            pipelineStageTemplateId={selectedStageTemplateId}
          />
        )}
      </Drawer>
      <Modal ariaLabel="Delete Stage" open={isDeleteModalOpen}>
        <ConfirmDelete
          title="Delete Stage"
          text="Are you sure you want to delete this stage?"
          setOpen={setIsDeleteModalOpen}
          onConfirmDelete={() => {
            handleDeleteStage(selectedStageId);
            setIsDeleteModalOpen(false);
          }}
        />
      </Modal>
    </Box>
  );
};

export default PipelineSteps;
