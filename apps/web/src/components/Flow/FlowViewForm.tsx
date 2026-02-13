import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { PencilSimple, X } from '@phosphor-icons/react';
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Field,
  Flex,
  InputText,
  Label,
  Text,
  Drawer,
  useDrawer,
} from '@wraft/ui';
import toast from 'react-hot-toast';

import { IconFrame } from 'common/Atoms';
import { fetchAPI, postAPI, putAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import FlowForm from './FlowForm';
import { Droppable } from './Droppable';
import StateForm from './StateForm';

interface FlowVersion {
  id: string;
  version_number: number;
  status: 'draft' | 'published';
  controlled: boolean;
  control_data?: Record<string, any>;
  creator?: any;
  inserted_at: string;
  updated_at: string;
}

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

  // Version state
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [activeVersion, setActiveVersion] = useState<FlowVersion | null>(null);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const { register, setValue } = useForm();
  const stateDrawer = useDrawer();
  const stateFormDrawer = useDrawer();
  const router = useRouter();
  const flowId: string = router.query.id as string;
  const { hasPermission } = usePermission();

  const hasDraft = versions.some((v) => v.status === 'draft');

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
      loadVersions(flowId);
    }
  }, [flowId, rerender]);

  const loadFlow = async (fId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAPI(`flows/${fId}`);
      const {
        flow: flowData,
        states: flowStates,
        versions: flowVersions,
      }: any = response;

      setFlow(flowData);
      // Sort states by order to ensure consistent display
      const sortedStates =
        flowStates && Array.isArray(flowStates)
          ? [...flowStates].sort(
              (a: any, b: any) => (a.order || 0) - (b.order || 0),
            )
          : flowStates;
      setStates(sortedStates);
      setEditableStates(sortedStates);
      setValue('name', flowData.name);

      // Set versions from show response and load version-specific states
      if (flowVersions && flowVersions.length > 0) {
        setVersions(flowVersions);
        // Default to the latest published version, load its states
        const latestPublished = [...flowVersions]
          .filter((v: FlowVersion) => v.status === 'published')
          .sort(
            (a: FlowVersion, b: FlowVersion) =>
              b.version_number - a.version_number,
          )[0];
        const target = latestPublished || flowVersions[0];
        if (target && !activeVersion) {
          await switchVersion(target.id);
        }
      }
    } catch (error) {
      console.error('Failed to load flow:', error);
      setError('Failed to load flow data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async (fId: string) => {
    try {
      const response: any = await fetchAPI(`flows/${fId}/versions`);
      if (response?.versions) {
        setVersions(response.versions);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  };

  const switchVersion = async (versionId: string) => {
    try {
      setLoading(true);
      const response: any = await fetchAPI(`flow_versions/${versionId}`);
      const { version, states: versionStates } = response;
      setActiveVersion(version);
      setIsDraft(version.status === 'draft');

      const sortedStates =
        versionStates && Array.isArray(versionStates)
          ? [...versionStates].sort(
              (a: any, b: any) => (a.order || 0) - (b.order || 0),
            )
          : versionStates;
      setStates(sortedStates);
      setEditableStates(sortedStates);
      setIsEditMode(false);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to switch version:', error);
      toast.error('Failed to load version');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraft = async () => {
    try {
      const response: any = await postAPI(`flows/${flowId}/versions`, {});
      const { version } = response;
      await switchVersion(version.id);
      await loadVersions(flowId);
      toast.success('Draft version created');
    } catch (error: any) {
      const msg =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.error ||
        'Failed to create draft version';
      toast.error(msg);
    }
  };

  const handlePublish = async () => {
    if (!activeVersion) return;
    try {
      await postAPI(`flow_versions/${activeVersion.id}/publish`, {});
      await switchVersion(activeVersion.id);
      await loadVersions(flowId);
      toast.success(`Version ${activeVersion.version_number} published`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.error ||
        'Failed to publish version';
      toast.error(msg);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Exiting edit mode - reset changes
      setEditableStates(states);
      setHasChanges(false);
    } else {
      // Entering edit mode - initialize editableStates with current states
      setEditableStates(states);
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
      setError(null);

      // Validate that all states have IDs (they should all be saved states)
      const statesWithoutIds = editableStates.filter(
        (state) => !state.id || !state.id.trim(),
      );
      if (statesWithoutIds.length > 0) {
        toast.error(
          'Some states are not saved yet. Please save all states before reordering.',
          {
            duration: 3000,
            position: 'top-right',
          },
        );
        setLoading(false);
        return;
      }

      // Update each state's order individually to avoid issues
      // with the flow-level align-states endpoint and versioned states
      await Promise.all(
        editableStates.map((state, index) =>
          putAPI(`states/${state.id}`, {
            state: state.state,
            order: index + 1,
            approvers: { add: [], remove: [] },
          }),
        ),
      );

      // Reload the active version to get the updated state data
      if (activeVersion) {
        await switchVersion(activeVersion.id);
      } else {
        await loadFlow(flowId);
      }

      // Update the local state
      setHasChanges(false);
      setIsEditMode(false);

      // Show success message
      toast.success('State order updated successfully', {
        duration: 2000,
        position: 'top-right',
      });
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      const errorMessage =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save state order changes. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewState = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Add new state clicked');
    setEditingState(null);
    setIsStateFormOpen(true);
  };

  const editState = (state: any) => {
    if (!state) {
      console.error('No state provided to editState');
      return;
    }
    console.log('Editing state:', state);
    // Ensure we have the correct state structure
    const stateToEdit = {
      id: state.id,
      state: state.state || state.name,
      type: state.type || 'reviewer',
      order: state.order || 0,
      approvers: state.approvers || [],
      inserted_at: state.inserted_at,
      updated_at: state.updated_at,
    };
    setEditingState(stateToEdit);
    setIsStateFormOpen(true);
  };

  const handleStateSaved = async (_savedState: any) => {
    // Reload the active version or flow to get the latest state data
    if (activeVersion) {
      await switchVersion(activeVersion.id);
    } else {
      await loadFlow(flowId);
    }
    setHasChanges(true);
    setEditingState(null);
    setIsStateFormOpen(false);
  };

  const handleCloseStateForm = () => {
    setIsStateFormOpen(false);
    setEditingState(null);
  };

  const getHighestOrder = () => {
    if (!editableStates || editableStates.length === 0) {
      return 0;
    }
    return Math.max(...editableStates.map((s: any) => s.order || 0));
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

          {/* Version Bar */}
          {activeVersion && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              py="sm"
              px="md"
              bg="gray.50"
              borderRadius="md"
              mb="md"
              border="1px solid"
              borderColor="border">
              <Flex alignItems="center" gap="sm">
                <Text fontSize="xs" color="text.secondary" fontWeight="medium">
                  Version {activeVersion.version_number}
                </Text>
                {isDraft ? (
                  <Box
                    bg="orange.100"
                    color="orange.700"
                    px="sm"
                    py="xs"
                    borderRadius="sm">
                    <Text fontSize="xs" fontWeight="medium">
                      Draft
                    </Text>
                  </Box>
                ) : (
                  <Box
                    bg="green.100"
                    color="green.700"
                    px="sm"
                    py="xs"
                    borderRadius="sm">
                    <Text fontSize="xs" fontWeight="medium">
                      Published
                    </Text>
                  </Box>
                )}
              </Flex>

              <Flex alignItems="center" gap="sm">
                {versions.length > 1 && (
                  <DropdownMenu.Provider>
                    <DropdownMenu.Trigger>
                      <Button variant="ghost" size="xs">
                        All Versions ({versions.length})
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu aria-label="Version switcher">
                      {versions.map((v) => (
                        <DropdownMenu.Item
                          key={v.id}
                          onClick={() => switchVersion(v.id)}>
                          v{v.version_number} — {v.status}
                          {v.id === activeVersion?.id ? ' (viewing)' : ''}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu>
                  </DropdownMenu.Provider>
                )}

                {!hasDraft && hasPermission('flow', 'manage') && (
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={handleCreateDraft}>
                    + New Version
                  </Button>
                )}

                {isDraft && hasPermission('flow', 'manage') && (
                  <Button variant="primary" size="xs" onClick={handlePublish}>
                    Publish
                  </Button>
                )}
              </Flex>
            </Flex>
          )}

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
                {(isDraft || !activeVersion) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEditModeToggle}>
                    {isEditMode ? (
                      <>
                        <IconFrame color="gray.800" mr="xs">
                          <X size={16} weight="regular" />
                        </IconFrame>
                        Cancel
                      </>
                    ) : (
                      <>
                        <IconFrame color="gray.800" mr="xs">
                          <PencilSimple size={16} weight="regular" />
                        </IconFrame>
                        Edit
                      </>
                    )}
                  </Button>
                )}
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
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={addNewState}>
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
                                type="button"
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

      <Drawer
        open={isStateFormOpen}
        store={stateFormDrawer}
        aria-label="state form drawer"
        withBackdrop={true}
        onClose={handleCloseStateForm}>
        {isStateFormOpen && flowId && (
          <StateForm
            flowId={flowId}
            flowVersionId={activeVersion?.id}
            editingState={editingState}
            onClose={handleCloseStateForm}
            onSave={handleStateSaved}
            highestOrder={getHighestOrder()}
          />
        )}
      </Drawer>
    </React.Fragment>
  );
};
export default FlowViewForm;
