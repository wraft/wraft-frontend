import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  Label,
  Select,
  Field,
} from 'theme-ui';

import PageHeader from '../PageHeader';
import PipelineSteps from './PipelineSteps';
import MenuStepsIndicator from '../MenuStepsIndicator';
import Modal from '../Modal';
import { ConfirmDelete } from '../common';
import PipelineLogs from './PipelineLogs';
import { deleteAPI, fetchAPI } from 'utils/models';
import toast from 'react-hot-toast';

const PipelineView = () => {
  const [rerender, setRerender] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<any>([]);
  const [formData, setFormData] = useState<any>();

  console.log(pipelineData, 'logpipe');
  console.log(formData, 'logformdata');

  const router = useRouter();

  const cId: string = router.query.id as string;

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
    deleteAPI(`pipelines/${cId}`)
      .then(() => {
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Deleted Successfully', { duration: 1000 });
        Router.push('/manage/pipelines');
      })
      .catch(() => {
        toast.error('Delete Failed', { duration: 1000 });
      });
  };

  const titles = ['Steps', 'Configure', 'Logs'];

  return (
    <Box>
      <PageHeader title={pipelineData.name}>
        {/* <Flex mt={'auto'} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            <Button variant="buttonSecondary" type="button">
              Run
            </Button>
            <Button ml={2} variant="buttonPrimary" type="button">
              Save
            </Button>
          </Flex>
        </Flex> */}
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
                    <Button
                      variant="delete"
                      onClick={() => {
                        setIsOpen(true);
                      }}>
                      Delete Pipeline
                    </Button>
                  </Box>
                </Box>
              </Flex>
            </Box>
            <Box
              sx={{
                display: formStep === 3 ? 'block' : 'none',
              }}>
              <PipelineLogs rerender={rerender} setRerender={setRerender} />
            </Box>
          </Box>
        </Flex>
      </Container>
      <Modal isOpen={isOpen}>
        {
          <ConfirmDelete
            title="Delete Pipeline"
            text="Are you sure you want to delete ?"
            setOpen={setIsOpen}
            onConfirmDelete={() => {
              onDelete();
              setIsOpen(false);
            }}
          />
        }
      </Modal>
    </Box>
  );
};
export default PipelineView;
