import React, { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Button,
  Text,
  Label,
  InputText as Input,
  Field,
} from '@wraft/ui';
import { Modal, Drawer, useDrawer } from '@wraft/ui';
import toast from 'react-hot-toast';

import PageHeader from 'common/PageHeader';
import MenuStepsIndicator from 'common/MenuStepsIndicator';
import { deleteAPI, fetchAPI } from 'utils/models';

import PipelineSteps from './PipelineSteps';
import PipelineLogs from './PipelineLogs';
import PipelineFormEntry from './PipelineFormEntry';

const PipelineView = () => {
  const [rerender, setRerender] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(0);
  const [pipelineData, setPipelineData] = useState<any>([]);
  const [formData, setFormData] = useState<any>();
  const [isDelete, setDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sourceId, setSourceId] = useState<any>();

  const router = useRouter();

  const cId: string = router.query.id as string;

  const formMenuDrawer = useDrawer();
  const goTo = (step: number) => {
    setFormStep(step);
  };

  const loadDetails = () => {
    fetchAPI(`pipelines/${cId}`).then((data: any) => {
      setPipelineData(data);
    });
  };

  const loadForm = () => {
    if (pipelineData.source_id) {
      fetchAPI(`forms/${pipelineData.source_id}`).then((data: any) => {
        setFormData(data);
      });
    }
  };

  useEffect(() => {
    loadDetails();
  }, [cId, rerender]);

  useEffect(() => {
    loadForm();
  }, [pipelineData.source_id]);

  const onDelete = () => {
    if (inputValue && inputValue.trim() == pipelineData.name) {
      deleteAPI(`pipelines/${cId}`).then(() => {
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Deleted Successfully', { duration: 1000 });
        Router.push('/pipelines');
        setDelete(false);
      });
    } else {
      toast.error('Name does not match', { duration: 2000 });
    }
  };

  const onConfirm = () => {
    setDelete(true);
  };

  const onRunClick = (formId: any) => {
    setIsOpen(true);
    setSourceId(formId);
  };

  const titles = ['Steps', 'Configure', 'Logs'];

  return (
    <Box>
      <PageHeader title={pipelineData.name}>
        <Flex marginTop="auto" justify="space-between">
          <Flex>
            <Button
              variant="secondary"
              onClick={() => onRunClick(pipelineData?.source_id)}
              type="button"
              disabled={pipelineData.stages?.length == 0}>
              Run
            </Button>
            {/* <Button ml={2} variant="buttonPrimary" type="button">
              Save
            </Button> */}
          </Flex>
        </Flex>
      </PageHeader>

      <Flex px="md" py="md" gap="md">
        <MenuStepsIndicator titles={titles} formStep={formStep} goTo={goTo} />

        <Box w="80%" display={formStep === 0 ? 'block' : 'none'}>
          <PipelineSteps rerender={rerender} setRerender={setRerender} />
        </Box>

        <Box w="50%" display={formStep === 1 ? 'block' : 'none'}>
          <Flex direction="column" gap="md" background="#fff" px="lg" py="lg">
            <Field label="Name" disabled>
              <Input name="name" disabled value={pipelineData.name} />
            </Field>

            <Field label="Source" disabled>
              <Input name="source" disabled value={pipelineData.source} />
            </Field>

            <Field label="Form" disabled>
              <Input
                name="form"
                disabled
                value={formData ? formData.name : ''}
              />
            </Field>

            <Box alignSelf="flex-end" mt="sm">
              <Box marginTop={2}>
                <Button danger onClick={onConfirm}>
                  Delete Pipeline
                </Button>
              </Box>
            </Box>
          </Flex>
        </Box>

        <Box w="80%" display={formStep === 2 ? 'block' : 'none'}>
          <PipelineLogs rerender={rerender} setRerender={setRerender} />
        </Box>
      </Flex>

      <Modal
        size="md"
        ariaLabel="pipelinedelte"
        open={isDelete}
        onClose={() => setDelete(false)}>
        <>
          <Text padding="12px 16px" display="inline-block">
            Verify pipeline delete request
          </Text>
          <Box
            padding="12px 0 16px 0"
            borderTop="1px solid"
            borderColor="border">
            <Box padding="0 16px">
              <Box marginTop="24px">
                <Label as="label" color="black.800">
                  <span>
                    {`To confirm, type "${pipelineData.name}" in the box below`}
                  </span>
                </Label>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </Box>
              <Flex gap={3} padding="16px 0 0 0">
                <Button onClick={onDelete} variant="delete">
                  Delete Pipeline
                </Button>
                <Button onClick={() => setDelete(false)} variant="secondary">
                  Cancel
                </Button>
              </Flex>
            </Box>
          </Box>
        </>
      </Modal>
      <Drawer open={isOpen} store={formMenuDrawer} withBackdrop={true}>
        {isOpen && (
          <>
            <PipelineFormEntry
              formId={sourceId}
              pipelineId={cId}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </Drawer>
    </Box>
  );
};
export default PipelineView;
