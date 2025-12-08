import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  Box,
  Button,
  Field,
  Flex,
  InputText,
  Label,
  Text,
  Drawer,
  useDrawer,
} from '@wraft/ui';
import toast from 'react-hot-toast';

import { fetchAPI, putAPI } from 'utils/models';

import FlowForm from './FlowForm';
import { Droppable } from './Droppable';

export interface States {
  total_pages: number;
  total_entries: number;
  states: StateElement[];
  page_number: number;
}

export interface StateElement {
  state: StateState;
  flow: Flow;
  creator: Creator;
}

export interface Creator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface Flow {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

export interface StateState {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface StateFormProps {
  content: StateElement[];
  onSave: any;
  onDelete: React.MouseEventHandler;
  hidden?: boolean;
  onAttachApproval?: React.MouseEventHandler;
  dialog?: any;
  onSorted?: any;
}

const FlowViewForm = () => {
  const [flow, setFlow] = useState<Flow>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [states, setStates] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableStates, setEditableStates] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isStateFormOpen, setIsStateFormOpen] = useState<boolean>(false);
  const [editingState, setEditingState] = useState<any>(null);

  const { register, setValue } = useForm();
  const stateDrawer = useDrawer();
  const router = useRouter();
  const flowId: string = router.query.id as string;

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, rerender]);

  const loadFlow = async (fId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAPI(`flows/${fId}`);
      const { flow: flowData, states: flowStates }: any = response;

      setFlow(flowData);
      setStates(flowStates);
      setEditableStates(flowStates);
      setValue('name', flowData.name);
    } catch (error) {
      console.error('Failed to load flow:', error);
      setError('Failed to load flow data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Exiting edit mode - reset changes
      setEditableStates(states);
      setHasChanges(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleStatesChange = (newStates: any[]) => {
    setEditableStates(newStates);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Update each state individually with the new order - using correct endpoint from Swagger docs
      const updatePromises = editableStates.map((state, index) => {
        // For reordering, we don't want to change approvers, so send empty add/remove arrays
        const stateData = {
          state: state.state,
          type: state.type,
          order: index + 1,
          approvers: {
            add: [],
            remove: [],
          },
        };

        return putAPI(`states/${state.id}`, stateData);
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Update the local state
      setStates(editableStates);
      setHasChanges(false);
      setIsEditMode(false);

      // Show success message
      toast.success('State order updated successfully', {
        duration: 2000,
        position: 'top-right',
      });

      console.log('States reordered successfully:', editableStates);
    } catch (error) {
      console.error('Failed to save changes:', error);
      setError('Failed to save state order changes. Please try again.');
      toast.error('Failed to save state order changes. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewState = () => {
    setEditingState(null);
    setIsStateFormOpen(true);
  };

  const editState = (state: any) => {
    console.log('Editing state:', state);
    console.log('State properties:', {
      id: state.id,
      state: state.state,
      type: state.type,
      order: state.order,
      approvers: state.approvers,
    });
    setEditingState(state);
    setIsStateFormOpen(true);
  };

  const handleStateSaved = (savedState: any) => {
    if (editingState) {
      // Update existing state
      const updatedStates = editableStates.map((state) =>
        state.id === editingState.id ? savedState : state,
      );
      setEditableStates(updatedStates);
      setStates(updatedStates);
    } else {
      // Add new state
      const updatedStates = [...editableStates, savedState];
      setEditableStates(updatedStates);
      setStates(updatedStates);
    }
    setHasChanges(true);
    setEditingState(null);
  };

  if (loading) {
    return (
      <Box
        as="div"
        bg="background-primary"
        maxWidth="800px"
        w="100%"
        p={{ base: 'md', md: 'xl' }}
        borderRadius="lg"
        border="1px solid"
        borderColor="border"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="400px">
        <Text fontSize="lg" color="text.secondary">
          Loading flow data...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        as="div"
        bg="background-primary"
        maxWidth="800px"
        w="100%"
        p={{ base: 'md', md: 'xl' }}
        borderRadius="lg"
        border="1px solid"
        borderColor="error.200"
        textAlign="center">
        <Text fontSize="lg" color="error.600" mb="md">
          {error}
        </Text>
        <Button variant="secondary" onClick={() => loadFlow(flowId)}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Box
        as="div"
        // bg="background-primary"
        maxWidth="1000px"
        w="100%"
        p={{ base: 'md', md: 'lg' }}
        borderRadius="md"
        // border="1px solid"
        // borderColor="border"
      >
        <Box data-flow={flow?.id}>
          <Box mb="sm">
            <Text fontSize="xl" color="text.primary">
              {flow?.name || 'Untitled Flow'}
            </Text>
          </Box>

          <Box py="sm">
            <Flex justifyContent="space-between" alignItems="center" mb="md">
              <Flex alignItems="center" gap="md">
                <Label fontSize="md" fontWeight="semibold" color="text.primary">
                  Workflow States
                </Label>
                <Text fontSize="xs" color="text.secondary" fontWeight="medium">
                  {states?.length || 0}{' '}
                  {states?.length === 1 ? 'step' : 'steps'}
                </Text>
              </Flex>
              <Flex alignItems="center" gap="sm">
                {isEditMode && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasChanges}>
                    Save Changes
                  </Button>
                )}
                <Button
                  variant={isEditMode ? 'secondary' : 'secondary'}
                  size="sm"
                  onClick={handleEditModeToggle}>
                  {isEditMode ? 'Cancel' : 'Edit'}
                </Button>
              </Flex>
            </Flex>

            {states && states.length > 0 ? (
              isEditMode ? (
                <Box>
                  <Droppable
                    states={editableStates}
                    setStates={handleStatesChange}
                    highestOrder={editableStates.length}
                  />
                  <Box mt="md" textAlign="center">
                    <Button variant="secondary" size="sm" onClick={addNewState}>
                      + Add New State
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  border="1px solid"
                  borderColor="border"
                  borderRadius="md"
                  overflow="hidden"
                  bg="background-primary">
                  {/* Table Header */}
                  <Box
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="border"
                    px="md"
                    py="sm">
                    <Flex alignItems="center" gap="md">
                      <Box w="50px" textAlign="center">
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="text.secondary"
                          textTransform="uppercase"
                          letterSpacing="0.5px">
                          #
                        </Text>
                      </Box>
                      <Box flex="1">
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="text.secondary"
                          textTransform="uppercase"
                          letterSpacing="0.5px">
                          State Name
                        </Text>
                      </Box>
                      <Box w="100px" textAlign="center">
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="text.secondary"
                          textTransform="uppercase"
                          letterSpacing="0.5px">
                          Type
                        </Text>
                      </Box>
                      <Box w="200px" textAlign="left">
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="text.secondary"
                          textTransform="uppercase"
                          letterSpacing="0.5px">
                          Assignees
                        </Text>
                      </Box>
                      <Box w="80px" textAlign="center">
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="text.secondary"
                          textTransform="uppercase"
                          letterSpacing="0.5px">
                          Actions
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Table Body with Striped Rows */}
                  <Box>
                    {states.map((item: any, index: number) => {
                      const stateType = item?.type || 'reviewer';
                      const stateTypeConfig: Record<
                        string,
                        { color: string; bg: string; label: string }
                      > = {
                        reviewer: {
                          color: 'blue.600',
                          bg: 'blue.50',
                          label: 'Review',
                        },
                        editor: {
                          color: 'green.600',
                          bg: 'green.50',
                          label: 'Edit',
                        },
                        sign: {
                          color: 'purple.600',
                          bg: 'purple.50',
                          label: 'Sign',
                        },
                      };
                      const config =
                        stateTypeConfig[stateType] || stateTypeConfig.reviewer;
                      const isEven = index % 2 === 0;

                      return (
                        <Box
                          as="div"
                          key={index}
                          borderBottom={
                            index < states.length - 1 ? '1px solid' : 'none'
                          }
                          borderColor="border"
                          bg={isEven ? 'background-primary' : 'gray.25'}
                          transition="all 0.15s ease">
                          <Flex alignItems="center" gap="md" px="md" py="sm">
                            {/* Step Number */}
                            <Box w="50px" textAlign="center">
                              <Box
                                bg={config.bg}
                                color={config.color}
                                borderRadius="full"
                                w="28px"
                                h="28px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto">
                                <Text fontSize="xs" fontWeight="bold">
                                  {index + 1}
                                </Text>
                              </Box>
                            </Box>

                            {/* State Name */}
                            <Box as="div" flex="1">
                              <Text
                                as="div"
                                fontSize="sm2"
                                fontWeight="medium"
                                color="text.primary"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap">
                                {item.state}
                              </Text>
                            </Box>

                            {/* State Type */}
                            <Box w="100px" textAlign="center">
                              <Box
                                bg={config.bg}
                                color={config.color}
                                borderRadius="sm"
                                px="sm"
                                py="xs"
                                display="inline-block">
                                <Text
                                  fontSize="xs"
                                  fontWeight="medium"
                                  textTransform="capitalize">
                                  {config.label}
                                </Text>
                              </Box>
                            </Box>

                            {/* Assignees Column */}
                            <Box w="200px" textAlign="left">
                              {item.approvers && item.approvers.length > 0 ? (
                                <Flex
                                  alignItems="center"
                                  gap="sm"
                                  flexWrap="wrap">
                                  {item.approvers
                                    .slice(0, 3)
                                    .map((approver: any) => (
                                      <Flex
                                        key={approver.id}
                                        alignItems="center"
                                        gap="xs">
                                        <Avatar
                                          size="xs"
                                          src={approver.profile_pic}
                                          alt={approver.name}
                                        />
                                        <Text fontSize="sm2" fontWeight={500}>
                                          {approver.name}
                                        </Text>
                                      </Flex>
                                    ))}
                                  {item.approvers.length > 3 && (
                                    <Text fontSize="sm2" color="text.secondary">
                                      +{item.approvers.length - 3}
                                    </Text>
                                  )}
                                </Flex>
                              ) : (
                                <Text
                                  fontSize="xs"
                                  color="text.secondary"
                                  fontStyle="italic">
                                  Unassigned
                                </Text>
                              )}
                            </Box>

                            {/* Actions */}
                            <Box w="80px" textAlign="center">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  editState(item);
                                }}>
                                Edit
                              </Button>
                            </Box>
                          </Flex>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )
            ) : (
              <Box
                bg="gray.50"
                borderRadius="md"
                p="lg"
                textAlign="center"
                border="1px dashed"
                borderColor="border">
                <Text
                  fontSize="sm"
                  color="text.secondary"
                  mb="xs"
                  fontWeight="medium">
                  No workflow states configured
                </Text>
                <Text fontSize="xs" color="text.secondary">
                  Define your approval workflow by adding states
                </Text>
              </Box>
            )}
          </Box>

          {/* Footer Info */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mt="lg"
            pt="md"
            borderTop="1px solid"
            borderColor="border">
            <Text fontSize="xs" color="text.secondary">
              Last updated:{' '}
              {flow?.updated_at
                ? new Date(flow.updated_at).toLocaleDateString()
                : 'Unknown'}
            </Text>
          </Flex>
        </Box>
      </Box>

      <Drawer
        open={isOpen}
        store={stateDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && <FlowForm setOpen={setIsOpen} setRerender={setRerender} />}
      </Drawer>
    </React.Fragment>
  );
};
export default FlowViewForm;
