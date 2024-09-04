import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Text, Box, Flex } from 'theme-ui';
import { Drawer, useDrawer } from '@wraft/ui';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft } from '@phosphor-icons/react';

import { nodeTypes } from 'components/Workflow/Node';
import { edgeTypes } from 'components/Workflow/Edges';
import { fetchAPI } from 'utils/models';

export const Index: any = () => {
  const [nodeData, setNodeData] = useState<any>([]);
  const [edgeData, setEdgeData] = useState<any>([]);
  const [piplineDetails, setPiplineDetails] = useState<any>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSelected, setIsSelected] = useState(false);

  const router = useRouter();

  const id: any = router.query.id;

  const mobileMenuDrawer = useDrawer();

  console.log('nodes_new', nodes);

  useEffect(() => {
    setNodes(nodeData);
  }, [nodeData]);

  useEffect(() => {
    setEdges(edgeData);
  }, [edgeData]);

  useEffect(() => {
    const node = nodes.filter((node: any) => {
      if (node.selected) return true;
      return false;
    });
    if (node[0]) {
      setSelectedNode(node[0]);
      setIsSelected(true);
    } else {
      setSelectedNode('');
      setIsSelected(false);
    }
  }, [nodes]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (id) {
      loadPipeline(id);
    }
  }, [id]);

  const loadPipeline = (cid: string) => {
    fetchAPI(`pipelines/${cid}`).then((data: any) => {
      console.log('Pipeline-data', data);
      const nodeData = restructure(data);
      console.log('Pipeline-nodeData', nodeData);
      const edges = createEdges(data);
      console.log('Pipeline-edges', edges);

      setNodeData(nodeData);
      setEdgeData(edges);
      setPiplineDetails(data);
    });
  };

  const restructure = (source: any) => {
    const stages = source.stages || [];

    return [
      {
        id: '1',
        position: { x: 522, y: 63.75 },
        data: {
          label: source.name,
          source: source.source,
          id: source.id,
        },
        type: 'source',
      },
      ...stages.map((stage: any, index: any) => ({
        id: (index + 2).toString(),
        position: {
          x: 522,
          y: 200 + index * 150, // Adjust y position for each stage
        },
        type: 'templete',
        data: { label: stage.data_template.title },
      })),
    ];
  };

  const createEdges = (source: any) => {
    const stages = source.stages || [];

    return stages.map((_stage: any, index: any) => ({
      id: `e1-${index + 2}`, // Edge ID
      source: '1', // Always starts from the source node
      target: (index + 2).toString(), // Target node corresponds to the stage index
      type: 'condition',
      data: {
        isAddButtonHidden: true,
      },
    }));
  };

  const onDrop = (event: any) => {
    // event.preventDefault();

    console.log('onDrop', event);

    // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    // const type = event.dataTransfer.getData("application/reactflow");
    // const label = event.dataTransfer.getData("content");
    // console.log(reactFlowInstance, "reactIns");
    // const position = reactFlowInstance.project({
    //   x: event.clientX - reactFlowBounds.left,
    //   y: event.clientY - reactFlowBounds.top
    // });
    // const newNode = {
    //   id: getId(),
    //   type,
    //   position,
    //   data: { heading: "Send Message", content: label }
    // };
    // setNodes((es) => es.concat(newNode));
    // setSelectedNode(newNode.id);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Flex
        variant="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          alignItems: 'center',
          bg: 'gray.100',
          borderBottom: 'solid 1px',
          borderColor: 'border',
          py: 2,
          px: 3,
        }}>
        <Box
          sx={{
            flexBasis: ['auto', '100%'],
            order: -1,
          }}>
          <Box
            sx={{
              color: 'gray.1200',
            }}>
            <Flex sx={{ alignItems: 'center', gap: 3 }}>
              <ArrowLeft cursor="pointer" onClick={goBack} size={18} />

              <Flex
                variant="navtitle"
                sx={{
                  alignItems: 'center',
                  fontWeight: 'heading',
                  verticalAlign: 'middle',
                  gap: 3,
                }}>
                <Text sx={{ fontSize: 'sm', fontWeight: 500 }}>
                  {piplineDetails?.name}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Flex>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // onDrop={onDrop}
        onConnect={onConnect}>
        <Controls />
        <MiniMap />
        <Background color="#ccc" gap={12} size={1} />
      </ReactFlow>
      <Drawer
        open={true}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={false}>
        <Drawer.Header>
          <Drawer.Title>{selectedNode?.data?.label}</Drawer.Title>
        </Drawer.Header>
        <Box sx={{ width: '300px' }}>{JSON.stringify(selectedNode)}</Box>
      </Drawer>
    </Box>
  );
};

export default Index;
