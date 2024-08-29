import React, { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Button,
  Container,
  Field,
  Text,
  Label,
  Input,
} from 'theme-ui';
import { Modal } from '@wraft/ui';
import { Drawer, useDrawer } from '@wraft/ui';
import { X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { deleteAPI, fetchAPI } from 'utils/models';

import PageHeader from '../PageHeader';
import PipelineSteps from './PipelineSteps';
import MenuStepsIndicator from '../MenuStepsIndicator';
import PipelineLogs from './PipelineLogs';
import PipelineFormEntry from '../PipelineFormEntry';

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
  const [formName, setFormName] = useState<any>();

  const router = useRouter();

  const cId: string = router.query.id as string;

  const formMenuDrawer = useDrawer();

  console.log(pipelineData, 'logdata');

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
  }, [cId]);

  useEffect(() => {
    loadForm();
  }, [pipelineData.source_id]);

  const onDelete = () => {
    if (inputValue && inputValue.trim() == pipelineData.name) {
      deleteAPI(`pipelines/${cId}`).then(() => {
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Deleted Successfully', { duration: 1000 });
        Router.push('/manage/pipelines');
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
    console.log(formId, 'logform');

    setIsOpen(true);
    setSourceId(formId);
  };

  const titles = ['Steps', 'Configure', 'Logs'];

  return (
    <Box>
      <PageHeader title={pipelineData.name}>
        <Flex mt={'auto'} sx={{ justifyContent: 'space-between' }}>
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
      <Container variant="layout.pageFrame">
        <Flex>
          <MenuStepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: formStep === 0 ? 'block' : 'none',
              }}>
              <PipelineSteps rerender={rerender} setRerender={setRerender} />
            </Box>
            <Box
              sx={{
                display: formStep === 1 ? 'block' : 'none',
                width: '60ch',
              }}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: '28px',
                }}>
                <Box>
                  <Field
                    name="name"
                    label="Name"
                    disabled
                    defaultValue={pipelineData.name}
                  />
                </Box>
                <Box>
                  <Field
                    name="source"
                    label="Source"
                    color="gray.1200"
                    disabled
                    defaultValue={pipelineData.source}
                  />
                </Box>
                <Box>
                  <Field
                    name="form"
                    label="Form"
                    disabled
                    defaultValue={formData ? formData.name : ''}
                  />
                </Box>
                <Box sx={{ alignSelf: 'end' }}>
                  <Box mt={2}>
                    <Button variant="delete" onClick={onConfirm}>
                      Delete Pipeline
                    </Button>
                  </Box>
                </Box>
              </Flex>
            </Box>
            <Box
              sx={{
                display: formStep === 2 ? 'block' : 'none',
              }}>
              <PipelineLogs rerender={rerender} setRerender={setRerender} />
            </Box>
          </Box>
        </Flex>
      </Container>
      <Modal
        size="md"
        ariaLabel="pipelinedelte"
        open={isDelete}
        onClose={() => setDelete(false)}>
        <>
          <Text
            variant="pB"
            sx={{
              py: 3,
              px: 4,
              display: 'inline-block',
            }}>
            Verify pipeline delete request
          </Text>
          <Box
            sx={{
              pt: 3,
              pb: 4,
              borderTop: '1px solid',
              borderColor: 'border',
            }}>
            <Box sx={{ px: 4 }}>
              <Box sx={{ mt: '24px' }}>
                <Label variant="text.pR" sx={{ color: 'black.800' }}>
                  <span>
                    {`To confirm, type "${pipelineData.name}" in the box below`}
                  </span>
                </Label>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}></Input>
              </Box>
              <Flex sx={{ gap: 3, pt: 4 }}>
                <Button onClick={onDelete} variant="delete">
                  Delete Pipeline
                </Button>
                <Button onClick={() => setDelete(false)} variant="cancel">
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
            <Drawer.Header>
              <Drawer.Title>{formName}</Drawer.Title>
              <X
                size={20}
                weight="bold"
                cursor="pointer"
                onClick={() => setIsOpen(false)}
              />
            </Drawer.Header>
            <PipelineFormEntry
              formId={sourceId}
              pipelineId={cId}
              setIsOpen={setIsOpen}
              setFormName={setFormName}
            />
          </>
        )}
      </Drawer>
    </Box>
  );
};
export default PipelineView;
