import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Box, Flex, Text, InputText } from '@wraft/ui';
import styled from '@emotion/styled';

import PdfViewer from 'common/PdfViewer';

const MarginValue = styled(Box)`
  background: #f8fafc;
  border-radius: 4px;
  padding: 2px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  min-width: 60px;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const MarginInput = styled(InputText)`
  width: 100%;
  height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  border: none;
  background: transparent;

  &:focus {
    outline: none;
    background: #ffffff;
    border: 1px solid #3b82f6;
    border-radius: 3px;
  }
`;

const MarginHandle = styled(Box)<{
  isActive: boolean;
  interactive?: boolean;
  isVertical?: boolean;
}>`
  background: transparent;
  border: 1px dashed ${(props) => (props.isActive ? '#3b82f6' : '#065f46')};
  transition: all 0.2s ease;
  border-radius: 2px;
  user-select: none;
  pointer-events: all;

  ${(props) =>
    props.isVertical
      ? `
    border-left: none;
    border-right: none;
  `
      : `
    border-top: none;
    border-bottom: none;
  `}

  ${(props) =>
    props.interactive &&
    `
    &:hover {
      border-color: #2563eb;
      transform: scale(1.01);
    }
  `}
`;

const MarginOverlay = styled(Box)`
  background: rgba(59, 130, 246, 0.08);
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  transition: all 0.3s ease;
  pointer-events: none;

  &:hover {
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.6);
  }
`;

interface LayoutScalingProps {
  pdfUrl: string;
  containerWidth: number;
  containerHeight: number;
  initialMargins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onMarginsChange?: (margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => void;
  pdfDimensions?: {
    width: number;
    height: number;
  };
  interactive?: boolean;
  showControls?: boolean;
  controlsWidth?: number;
}

const GOOGLE_DOCS_MIN_MARGINS = {
  top: 0.5,
  right: 0.5,
  bottom: 0.5,
  left: 0.5,
};

const DEFAULT_MARGINS = {
  top: 2.54,
  right: 2.54,
  bottom: 2.54,
  left: 2.54,
};

export const LayoutScaling: React.FC<LayoutScalingProps> = ({
  pdfUrl,
  containerWidth,
  containerHeight,
  initialMargins = DEFAULT_MARGINS,
  onMarginsChange,
  pdfDimensions = {
    width: 21.0,
    height: 29.7,
  },
  interactive = true,
  showControls = true,
  controlsWidth = 270,
}) => {
  const [margins, setMargins] = useState(initialMargins);
  const [activeDrag, setActiveDrag] = useState<
    keyof typeof initialMargins | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce timer for margin changes
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatToTwoDecimals = (value: number): string => {
    return value.toFixed(2);
  };

  const [displayValues, setDisplayValues] = useState({
    top: formatToTwoDecimals(initialMargins.top),
    right: formatToTwoDecimals(initialMargins.right),
    bottom: formatToTwoDecimals(initialMargins.bottom),
    left: formatToTwoDecimals(initialMargins.left),
  });

  // Memoize scale calculations to prevent unnecessary recalculations
  const scaleData = useMemo(() => {
    const widthScale = containerWidth / pdfDimensions.width;
    const heightScale = containerHeight / pdfDimensions.height;
    const scale = Math.min(widthScale, heightScale);
    const scaledWidth = pdfDimensions.width * scale;
    const scaledHeight = pdfDimensions.height * scale;
    const offsetX = (containerWidth - scaledWidth) / 2;
    const offsetY = (containerHeight - scaledHeight) / 2;

    return { scale, scaledWidth, scaledHeight, offsetX, offsetY };
  }, [containerWidth, containerHeight, pdfDimensions]);

  // Memoize content area calculations
  const contentArea = useMemo(
    () => ({
      width: pdfDimensions.width - margins.left - margins.right,
      height: pdfDimensions.height - margins.top - margins.bottom,
    }),
    [margins, pdfDimensions],
  );

  // Debounced callback for margin changes
  const debouncedMarginsChange = useCallback(
    (newMargins: typeof margins) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (onMarginsChange) {
          onMarginsChange(newMargins);
        }
      }, 150); // Only call after 150ms of no changes
    },
    [onMarginsChange],
  );

  // Handle margin dragging with optimized performance
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activeDrag || !containerRef.current || !interactive) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newMargins = { ...margins };

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const relativeX = (x - scaleData.offsetX) / scaleData.scale;
      const relativeY = (y - scaleData.offsetY) / scaleData.scale;

      switch (activeDrag) {
        case 'top':
          newMargins.top = Math.max(
            GOOGLE_DOCS_MIN_MARGINS.top,
            Math.min(
              relativeY,
              pdfDimensions.height -
                margins.bottom -
                GOOGLE_DOCS_MIN_MARGINS.bottom,
            ),
          );
          break;
        case 'right':
          newMargins.right = Math.max(
            GOOGLE_DOCS_MIN_MARGINS.right,
            Math.min(
              pdfDimensions.width - relativeX,
              pdfDimensions.width - margins.left - GOOGLE_DOCS_MIN_MARGINS.left,
            ),
          );
          break;
        case 'bottom':
          newMargins.bottom = Math.max(
            GOOGLE_DOCS_MIN_MARGINS.bottom,
            Math.min(
              pdfDimensions.height - relativeY,
              pdfDimensions.height - margins.top - GOOGLE_DOCS_MIN_MARGINS.top,
            ),
          );
          break;
        case 'left':
          newMargins.left = Math.max(
            GOOGLE_DOCS_MIN_MARGINS.left,
            Math.min(
              relativeX,
              pdfDimensions.width -
                margins.right -
                GOOGLE_DOCS_MIN_MARGINS.right,
            ),
          );
          break;
      }

      setMargins(newMargins);
      // Don't call the callback during dragging - wait for mouse up
    },
    [activeDrag, margins, scaleData, pdfDimensions, interactive],
  );

  const handleMouseUp = useCallback(() => {
    if (activeDrag) {
      // Call the callback immediately when dragging ends
      if (onMarginsChange) {
        onMarginsChange(margins);
      }
    }
    setActiveDrag(null);
  }, [activeDrag, margins, onMarginsChange]);

  useEffect(() => {
    if (activeDrag && interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [activeDrag, handleMouseMove, handleMouseUp, interactive]);

  // Only trigger debounced callback for non-drag margin changes (like input changes)
  useEffect(() => {
    if (!activeDrag) {
      debouncedMarginsChange(margins);
    }
  }, [margins, debouncedMarginsChange, activeDrag]);

  // Update display values when margins change
  useEffect(() => {
    setDisplayValues({
      top: formatToTwoDecimals(margins.top),
      right: formatToTwoDecimals(margins.right),
      bottom: formatToTwoDecimals(margins.bottom),
      left: formatToTwoDecimals(margins.left),
    });
  }, [margins]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleMouseDown = useCallback(
    (edge: keyof typeof initialMargins) => (e: React.MouseEvent) => {
      if (!interactive) return;
      e.preventDefault();
      e.stopPropagation();
      setActiveDrag(edge);
    },
    [interactive],
  );

  const handleMarginChange = (edge: keyof typeof margins, value: string) => {
    setDisplayValues((prev) => ({ ...prev, [edge]: value }));

    const numValue = parseFloat(value);

    if (value === '') {
      setMargins((prev) => ({
        ...prev,
        [edge]: GOOGLE_DOCS_MIN_MARGINS[edge],
      }));
    } else if (!isNaN(numValue)) {
      const maxValue =
        edge === 'top' || edge === 'bottom'
          ? pdfDimensions.height - GOOGLE_DOCS_MIN_MARGINS.bottom
          : pdfDimensions.width - GOOGLE_DOCS_MIN_MARGINS.right;

      const clampedValue = Math.max(
        GOOGLE_DOCS_MIN_MARGINS[edge],
        Math.min(numValue, maxValue),
      );

      const tempMargins = { ...margins, [edge]: clampedValue };
      const tempContentWidth =
        pdfDimensions.width - tempMargins.left - tempMargins.right;
      const tempContentHeight =
        pdfDimensions.height - tempMargins.top - tempMargins.bottom;

      if (tempContentWidth >= 1 && tempContentHeight >= 1) {
        setMargins(tempMargins);
      }
    }
  };

  const handleInputBlur = (edge: keyof typeof margins, value: string) => {
    const numValue = parseFloat(value);
    const roundedValue = Math.round(numValue * 100) / 100;

    if (isNaN(numValue) || value === '') {
      setDisplayValues((prev) => ({
        ...prev,
        [edge]: formatToTwoDecimals(margins[edge]),
      }));
    } else {
      const maxValue =
        edge === 'top' || edge === 'bottom'
          ? pdfDimensions.height - GOOGLE_DOCS_MIN_MARGINS.bottom
          : pdfDimensions.width - GOOGLE_DOCS_MIN_MARGINS.right;

      const clampedValue = Math.max(
        GOOGLE_DOCS_MIN_MARGINS[edge],
        Math.min(roundedValue, maxValue),
      );

      setMargins((prev) => ({ ...prev, [edge]: clampedValue }));
      setDisplayValues((prev) => ({
        ...prev,
        [edge]: formatToTwoDecimals(clampedValue),
      }));
    }
  };

  // Memoize MarginInputControl to prevent unnecessary re-renders
  const MarginInputControl = React.memo(function MarginInputControl({
    edge,
  }: {
    edge: keyof typeof margins;
  }) {
    const _cmValue = parseFloat(displayValues[edge]) || 0; // Prefix unused var with _
    // const inchValue = (_cmValue / 2.54).toFixed(2);
    return (
      <Box>
        <MarginValue>
          <MarginInput
            value={displayValues[edge]}
            onChange={(e) => handleMarginChange(edge, e.target.value)}
            onBlur={(e) => handleInputBlur(edge, e.target.value)}
            type="number"
            step="0.01"
            min={GOOGLE_DOCS_MIN_MARGINS[edge]}
            max={
              edge === 'top' || edge === 'bottom'
                ? pdfDimensions.height - GOOGLE_DOCS_MIN_MARGINS.bottom
                : pdfDimensions.width - GOOGLE_DOCS_MIN_MARGINS.right
            }
          />
        </MarginValue>
        {/* <Text fontSize="xs" color="gray.500" textAlign="center">
            {inchValue} in
          </Text> */}
      </Box>
    );
  });

  return (
    <Box w="100%">
      <Box
        ref={containerRef}
        position="relative"
        w={`${containerWidth}px`}
        h={`${containerHeight}px`}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        mx="auto">
        {/* PDF Content Container - Static, no re-renders */}
        <Box
          position="relative"
          w={`${scaleData.scaledWidth}px`}
          h={`${scaleData.scaledHeight}px`}>
          {/* PDF Viewer - Only renders once with the URL */}
          <Box position="absolute" top="0" left="0" w="100%" h="100%">
            <PdfViewer
              key={pdfUrl} // Only re-render when URL actually changes
              height={scaleData.scaledHeight}
              url={pdfUrl}
              pageNumber={1}
            />
          </Box>

          {/* Margin Overlay - Updates position but doesn't affect PDF */}
          <MarginOverlay
            position="absolute"
            top={`${margins.top * scaleData.scale}px`}
            left={`${margins.left * scaleData.scale}px`}
            w={`${contentArea.width * scaleData.scale}px`}
            h={`${contentArea.height * scaleData.scale}px`}
          />

          {/* Margin Handles */}
          <MarginHandle
            isActive={activeDrag === 'top'}
            interactive={interactive}
            position="absolute"
            left="0"
            w="100%"
            h="1px"
            cursor={interactive ? 'ns-resize' : 'default'}
            top={`${margins.top * scaleData.scale}px`}
            zIndex="100"
            onMouseDown={handleMouseDown('top')}
            isVertical={false}>
            {interactive && (
              <Text
                position="absolute"
                top="-20px"
                left="50%"
                transform="translateX(-50%)"
                fontSize="12px"
                fontWeight="bold"
                color={activeDrag === 'top' ? '#3b82f6' : '#60a5fa'}
                pointerEvents="none"
                whiteSpace="nowrap">
                {displayValues.top} cm
              </Text>
            )}
          </MarginHandle>

          <MarginHandle
            isActive={activeDrag === 'right'}
            interactive={interactive}
            position="absolute"
            top="0"
            h="100%"
            w="1px"
            cursor={interactive ? 'ew-resize' : 'default'}
            left={`${(pdfDimensions.width - margins.right) * scaleData.scale}px`}
            zIndex="100"
            onMouseDown={handleMouseDown('right')}
            isVertical={true}>
            {interactive && (
              <Text
                position="absolute"
                top="50%"
                right="-20px"
                transform="translateY(-50%)"
                fontSize="12px"
                fontWeight="bold"
                color={activeDrag === 'right' ? '#3b82f6' : '#60a5fa'}
                pointerEvents="none"
                whiteSpace="nowrap">
                {displayValues.right} cm
              </Text>
            )}
          </MarginHandle>

          <MarginHandle
            isActive={activeDrag === 'bottom'}
            interactive={interactive}
            position="absolute"
            left="0"
            w="100%"
            h="1px"
            cursor={interactive ? 'ns-resize' : 'default'}
            top={`${(pdfDimensions.height - margins.bottom) * scaleData.scale}px`}
            zIndex="100"
            onMouseDown={handleMouseDown('bottom')}
            isVertical={false}>
            {interactive && (
              <Text
                position="absolute"
                bottom="-20px"
                left="50%"
                transform="translateX(-50%)"
                fontSize="12px"
                fontWeight="bold"
                color={activeDrag === 'bottom' ? '#3b82f6' : '#60a5fa'}
                pointerEvents="none"
                whiteSpace="nowrap">
                {displayValues.bottom} cm
              </Text>
            )}
          </MarginHandle>

          <MarginHandle
            isActive={activeDrag === 'left'}
            interactive={interactive}
            position="absolute"
            top="0"
            h="100%"
            w="1px"
            cursor={interactive ? 'ew-resize' : 'default'}
            left={`${margins.left * scaleData.scale}px`}
            zIndex="100"
            onMouseDown={handleMouseDown('left')}
            isVertical={true}>
            {interactive && (
              <Text
                position="absolute"
                top="50%"
                left="-20px"
                transform="translateY(-50%)"
                fontSize="12px"
                fontWeight="bold"
                color={activeDrag === 'left' ? '#3b82f6' : '#60a5fa'}
                pointerEvents="none"
                whiteSpace="nowrap">
                {displayValues.left} cm
              </Text>
            )}
          </MarginHandle>
        </Box>
      </Box>

      {/* Input Controls */}
      {showControls && (
        <Box
          borderBottom="1px solid #e2e8f0"
          padding="16px"
          marginTop="16px"
          w="100%"
          maxWidth={`${controlsWidth}px`}
          mx="auto"
          bg="white">
          <Flex direction="column" gap="12px">
            <Flex justifyContent="space-between" alignItems="center" gap="md">
              <Box textAlign="left">
                <Text fontSize="sm" fontWeight="500" color="#64748b">
                  Top
                </Text>
              </Box>
              <MarginInputControl edge="top" />

              <Box textAlign="right">
                <Text fontSize="sm" fontWeight="500" color="#64748b">
                  Bottom
                </Text>
              </Box>
              <MarginInputControl edge="bottom" />
            </Flex>

            <Flex justifyContent="space-between" alignItems="center" gap="md">
              <Box textAlign="left">
                <Text fontSize="sm" fontWeight="500" color="#64748b">
                  Left
                </Text>
              </Box>
              <MarginInputControl edge="left" />

              <Box textAlign="right">
                <Text fontSize="sm" fontWeight="500" color="#64748b">
                  Right
                </Text>
              </Box>
              <MarginInputControl edge="right" />
            </Flex>
          </Flex>
        </Box>
      )}

      <Flex justifyContent="space-between" mt="xs" mx="auto" px="3xl">
        <Text fontSize="sm" fontWeight="500">
          Content area
        </Text>
        <Text fontSize="sm" fontWeight="500">
          {contentArea.width.toFixed(2)} × {contentArea.height.toFixed(2)} cm
        </Text>
      </Flex>
    </Box>
  );
};

export default LayoutScaling;
