import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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

import PageHeader from './PageHeader';
import ManageSidebar from './ManageSidebar';
import PipelineSteps from './PipelineSteps';
import MenuStepsIndicator from './MenuStepsIndicator';
import { Controller, useForm } from 'react-hook-form';
import Modal from './Modal';
import { ConfirmDelete } from './common';
import PipelineLogs from './PipelineLogs';
import { fetchAPI } from 'utils/models';

const PipelineView = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<any>();
  const [rerender, setRerender] = useState<any>(false);
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<any>([])

  const router = useRouter();

  const cId: string = router.query.id as string;

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const loadDetails = () => {
    fetchAPI(`pipelines/${cId}`).then((data:any) => {
      setPipelineData(data)
      console.log(data,"das");
      
    });
  };

  useEffect(() => {
    loadDetails();
  }, [cId]);

  const titles = ['Steps', 'Configure', 'History', 'Logs'];

  return (
    <Box>
      <PageHeader title="Pipelines">
        <Flex mt={'auto'} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            <Button variant="buttonSecondary" type="button">
              Run
            </Button>
            <Button ml={2} variant="buttonPrimary" type="button">
              Save
            </Button>
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
                  <Label htmlFor="slug">Source</Label>
                  <Controller
                    control={control}
                    name="slug"
                    defaultValue="contract"
                    rules={{ required: 'Please select a slug' }}
                    render={({ field }) => (
                      <Select mb={0} {...field} disabled>
                        <option>ERPNext</option>
                        <option>CSV</option>
                      </Select>
                    )}
                  />
                </Box>

                <Box sx={{ alignItems: 'center' }}>
                  <Text variant="pM" mr={2}>
                    Remove Pipeline
                  </Text>
                  <Box mt={3}>
                    <Button
                      variant="delete"
                      onClick={() => {
                        setIsOpen(true);
                      }}>
                      Remove
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
            setOpen={isOpen}
            onConfirmDelete={() => {
              setIsOpen(false);
            }}
          />
        }
      </Modal>
    </Box>
  );
};
export default PipelineView;
