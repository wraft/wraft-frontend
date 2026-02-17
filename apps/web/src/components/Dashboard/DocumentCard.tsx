import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import styled from '@xstyled/emotion';
import { Lightning } from '@phosphor-icons/react';

// import UserCard from 'common/UserCard';
import { TimeAgo } from 'common/Atoms';
import { StateProgress } from 'common/StateProgress';

const CardContainer = styled(Flex)`
  flex: 1;
  width: 100%;
  padding: sm lg;
  transition: box-shadow 0.2s;

  &:hover {
    background-color: var(--theme-ui-colors-gray-400);
    box-shadow: ${({ onClick }) =>
      onClick ? '2px 2px 4px rgba(4, 3, 3, 0.1)' : 'none'};
  }
`;

const VariantLine = styled.div<{ color?: string }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
  background: ${({ color }) => color || '#d1d5db'};
`;

const ExpiryBadge = styled(Box)<{
  urgency: 'critical' | 'warning' | 'info' | 'expired';
}>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${({ urgency }) => {
    switch (urgency) {
      case 'critical':
        return 'var(--colors-red-100)';
      case 'warning':
        return 'var(--colors-orange-100)';
      case 'info':
        return 'var(--colors-blue-100)';
      case 'expired':
        return 'var(--colors-gray-100)';
      default:
        return 'var(--colors-gray-100)';
    }
  }};
  color: ${({ urgency }) => {
    switch (urgency) {
      case 'critical':
        return 'var(--colors-red-700)';
      case 'warning':
        return 'var(--colors-orange-700)';
      case 'info':
        return 'var(--colors-blue-700)';
      case 'expired':
        return 'var(--colors-gray-700)';
      default:
        return 'red.400';
    }
  }};
  border: 1px solid
    ${({ urgency }) => {
      switch (urgency) {
        case 'critical':
          return 'var(--colors-red-200)';
        case 'warning':
          return 'var(--colors-orange-200)';
        case 'info':
          return 'var(--colors-blue-200)';
        case 'expired':
          return 'var(--colors-gray-200)';
        default:
          return 'var(--colors-gray-200)';
      }
    }};
`;

/**
 * Represents a state in the document flow
 */
interface DocumentState {
  id: string;
  state: string;
  order: number;
}

/**
 * Represents a state in the document flow
 */
interface FlowState {
  id: string;
  state: string;
  order: number;
}

/**
 * Represents the document flow
 */
interface DocumentFlow {
  states: FlowState[];
}

/**
 * Represents the creator of the document
 */
interface DocumentCreator {
  name: string;
  profile_pic: string;
}

/**
 * Represents the content of the document
 */
interface DocumentContent {
  id: string;
  title: string;
  updated_at: string;
  approval_status?: string;
  automated?: boolean;
  type?: number;
  instance_id?: string;
}

/**
 * Props for the DocumentCard component
 */
export interface DocumentCardProps {
  /** The content of the document */
  content: {
    content: DocumentContent;
    creator: DocumentCreator;
    state: DocumentState;
    flow?: DocumentFlow;
    content_type?: { color?: string };
  };
  /** Optional click handler for the card */
  onClick?: () => void;
  /** Optional className for styling */
  className?: string;
  /** Optional hideState for the card */
  hideState?: boolean;
  /** Optional expiry date for the document */
  expiryDate?: string;
}

/**
 * DocumentCard component displays a card representing a document with its metadata and state
 *
 * @example
 * ```tsx
 * <DocumentCard
 *   content={{
 *     content: {
 *       id: "123",
 *       title: "Contract Agreement",
 *       updated_at: "2024-03-20T10:00:00Z"
 *     },
 *     creator: {
 *       name: "John Doe",
 *       profile_pic: "https://example.com/profile.jpg"
 *     },
 *     state: {
 *       id: "1",
 *       state: "Draft",
 *       order: 1
 *     },
 *     flow: {
 *       states: [
 *         { id: "1", state: "Draft", order: 1 },
 *         { id: "2", state: "Review", order: 2 }
 *       ]
 *     }
 *   }}
 *   onClick={() => console.log("Card clicked")}
 *   expiryDate="2024-03-25T10:00:00Z"
 * />
 * ```
 */
export const DocumentCard: React.FC<DocumentCardProps> = ({
  content,
  onClick,
  hideState = false,
  className,
  expiryDate,
}) => {
  // Calculate currentActiveIndex similar to DocumentView logic
  const currentActiveIndex = useMemo(() => {
    if (content.flow?.states && content.flow.states.length > 0) {
      const { state } = content;
      const approval_status = content.content?.approval_status;

      if (state === null && !approval_status) {
        return 0;
      }

      if (state === null && approval_status) {
        return content.flow.states.length + 1;
      }

      if (state) {
        const statesIndex = content.flow.states.findIndex(
          (item: any) => item.id === state.id,
        );
        return statesIndex + 1;
      }
    }
    return 0;
  }, [content]);

  // Calculate nextState similar to DocumentView logic
  const nextState = useMemo(() => {
    if (content.flow?.states && content.flow.states.length > 0) {
      const { state } = content;
      const activeState = content.flow.states.find(
        (stateItem: any) => stateItem.id === state?.id,
      );

      if (activeState) {
        const currentIndex = content.flow.states.indexOf(activeState);
        const nextAvailableState =
          content.flow.states[currentIndex + 1] || null;
        return nextAvailableState;
      }

      if (content.state === null && content.flow.states.length > 0) {
        return content.flow.states[0];
      }
    }
    return null;
  }, [content]);

  // Calculate completion status and completed state IDs
  const stateProgressData = useMemo(() => {
    const flowStates = content.flow?.states || [];
    const currentState = content.state;
    const currentStateOrder = currentState?.order || 0;

    if (flowStates.length === 0) {
      return {
        completedStateIds: [],
        currentActiveIndex: 0,
      };
    }

    // Sort states by order to find the final state
    const sortedStates = [...flowStates].sort(
      (a: FlowState, b: FlowState) => (a.order || 0) - (b.order || 0),
    );
    const finalState = sortedStates[sortedStates.length - 1];
    const finalStateOrder = finalState?.order || 0;

    // If document is at the final state (published/completed), mark all states as completed
    // Otherwise, mark states before the current state as completed
    const isCompleted =
      currentStateOrder >= finalStateOrder && finalStateOrder > 0;

    const completedStateIds = isCompleted
      ? sortedStates.map((s: FlowState) => s.id)
      : sortedStates
          .filter((s: FlowState) => (s.order || 0) < currentStateOrder)
          .map((s: FlowState) => s.id);

    const calculatedActiveIndex = isCompleted
      ? sortedStates.length
      : sortedStates.findIndex((s: FlowState) => s.id === currentState?.id) + 1;

    return {
      completedStateIds,
      currentActiveIndex: calculatedActiveIndex,
    };
  }, [content.flow?.states, content.state]);

  // Calculate expiry information with memoization for performance
  const expiryInfo = useMemo(() => {
    if (!expiryDate) return null;

    const date = new Date(expiryDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgency: 'critical' | 'warning' | 'info' | 'expired';
    let text: string;

    if (diffDays < 0) {
      urgency = 'expired';
      text = `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 0) {
      urgency = 'critical';
      text = 'Today';
    } else if (diffDays === 1) {
      urgency = 'critical';
      text = 'Tomorrow';
    } else if (diffDays <= 7) {
      urgency = 'warning';
      text = `In ${diffDays} days`;
    } else {
      urgency = 'info';
      text = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return { urgency, text };
  }, [expiryDate]);

  return (
    <Box
      variant="block"
      mb="-1px"
      flex={1}
      p="0"
      w="100%"
      borderRadius="md"
      key={content.content.id}
      position="relative"
      className={className}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
    >
      <VariantLine color={content.content_type?.color} />
      <CardContainer>
        <Box>
          <Flex alignItems="center" gap="xs">
            <Text fontWeight="heading" fontSize="sm2">
              {content.content.title || 'Untitled'}
            </Text>
            {content.content.type === 3 && (
              <Lightning size={12} weight="bold" color="#62b997" />
            )}
          </Flex>
          <Flex gap="sm" alignItems="center" opacity={0.7}>
            <Flex alignItems="center" gap="xs">
              <Text fontSize="sm" color="text-secondary">
                {content?.content?.instance_id}
              </Text>
              <Text fontSize="sm" color="text-secondary">
                •
              </Text>
              <TimeAgo
                time={content.content.updated_at}
                fontSize="sm"
                color="text-secondary"
              />
              {expiryInfo && (
                <>
                  <Text fontSize="sm" color="text-secondary">
                    •
                  </Text>
                  <ExpiryBadge urgency={expiryInfo.urgency}>
                    {expiryInfo.text}
                  </ExpiryBadge>
                </>
              )}
            </Flex>
          </Flex>
        </Box>

        {/* User Avatar positioned between title and steps */}
        {/* <Box ml="auto" mr="md" display="flex" alignItems="center">
          <UserCard
            profilePic={content.creator.profile_pic}
            name=""
            size="sm"
          />
        </Box> */}
        {!hideState && (
          <Box ml="auto">
            <Box justifyContent="flex-start" alignItems="center">
              <Text
                as="span"
                fontSize="xs"
                textTransform="uppercase"
                fontWeight="heading"
                color="text-secondary"
                mb="xs"
              >
                {content.state?.state || 'Unknown'}
              </Text>
              <StateProgress
                states={content.flow?.states || []}
                activeStateId={content.state?.id}
                completedStateIds={stateProgressData.completedStateIds}
                currentActiveIndex={stateProgressData.currentActiveIndex}
                nextState={nextState}
              />
            </Box>
          </Box>
        )}
      </CardContainer>
    </Box>
  );
};
