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
  border-radius: 4px;
  padding: 2px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  min-height: 32px; // Reduced from 38px
  width: 60px;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const MarginInput = styled(InputText)`
  width: 100%;
  height: 28px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  border: none;
  padding: 2px 4px;
  line-height: 1.2;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const MarginHandle = styled(Box)<{ isActive: boolean; interactive?: boolean }>`
  background: none;
  transition: all 0.2s ease;
  user-select: none;

  ${(props) =>
    props.interactive &&
    `
    &:hover {
      transform: scale(1.2);
    }
  `}

  ${(props) =>
    props.isActive &&
    `
    background-color: rgba(0, 98, 34, 0.3);
  `}

  &::before {
    content: '';
    position: absolute;
    background-image: repeating-linear-gradient(
      ${(props) => (props.w === '100%' ? 'to right' : 'to bottom')},
      #0f766e,
      #0f766e 2px,
      transparent 2px,
      transparent 6px
    );
    ${(props) =>
      props.w === '100%'
        ? 'width: 100%; height: 4px; top: 50%; left: 0; transform: translateY(-50%);'
        : 'height: 100%; width: 4px; left: 50%; top: 0; transform: translateX(-50%);'}
    pointer-events: none;
  }
`;

const EdgeValueDisplay = styled(Box)`
  position: absolute;
  border-bottom: 1px solid;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  z-index: 200;
  pointer-events: none;
  user-select: none;
  min-width: 28px;
  text-align: center;
  line-height: 1.2;
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
}

export const LayoutScaling: React.FC<LayoutScalingProps> = ({
  pdfUrl,
  containerWidth,
  containerHeight,
  initialMargins = {
    top: 2.54,
    right: 2.54,
    bottom: 2.54,
    left: 2.54,
  },
  onMarginsChange,
  pdfDimensions = {
    width: 21.0,
    height: 29.7,
  },
  interactive = true,
  showControls = true,
}) => {
  const [margins, setMargins] = useState(initialMargins);
  const [activeDrag, setActiveDrag] = useState<
    keyof typeof initialMargins | null
  >(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const isUpdatingFromPropsRef = useRef(false);

  const pdfViewerRef = useRef<React.ReactElement | null>(null);
  const lastPdfUrlRef = useRef<string>('');
  const lastScaledHeightRef = useRef<number>(0);

  const [displayValues, setDisplayValues] = useState({
    top: String(Math.round(initialMargins.top * 100) / 100),
    right: String(Math.round(initialMargins.right * 100) / 100),
    bottom: String(Math.round(initialMargins.bottom * 100) / 100),
    left: String(Math.round(initialMargins.left * 100) / 100),
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('LayoutScaling: initialMargins changed:', initialMargins);

    const marginsChanged =
      margins.top !== initialMargins.top ||
      margins.right !== initialMargins.right ||
      margins.bottom !== initialMargins.bottom ||
      margins.left !== initialMargins.left;

    if (
      marginsChanged &&
      !activeDrag &&
      !isInputFocused &&
      isMountedRef.current
    ) {
      console.log('LayoutScaling: Updating margins from props');
      isUpdatingFromPropsRef.current = true;

      setMargins(initialMargins);
      setDisplayValues({
        top: String(Math.round(initialMargins.top * 100) / 100),
        right: String(Math.round(initialMargins.right * 100) / 100),
        bottom: String(Math.round(initialMargins.bottom * 100) / 100),
        left: String(Math.round(initialMargins.left * 100) / 100),
      });

      setTimeout(() => {
        isUpdatingFromPropsRef.current = false;
      }, 100);
    }
  }, [initialMargins, activeDrag, isInputFocused, margins]);

  const scaleCalculations = useMemo(() => {
    const widthScale = containerWidth / pdfDimensions.width;
    const heightScale = containerHeight / pdfDimensions.height;
    const scale = Math.min(widthScale, heightScale);

    const scaledWidth = pdfDimensions.width * scale;
    const scaledHeight = pdfDimensions.height * scale;

    const offsetX = (containerWidth - scaledWidth) / 2;
    const offsetY = (containerHeight - scaledHeight) / 2;

    return { scale, scaledWidth, scaledHeight, offsetX, offsetY };
  }, [containerWidth, containerHeight, pdfDimensions]);

  useEffect(() => {
    const needsNewViewer =
      lastPdfUrlRef.current !== pdfUrl ||
      lastScaledHeightRef.current !== scaleCalculations.scaledHeight;

    if (needsNewViewer) {
      console.log('Creating new PDF viewer - URL or height changed');
      lastPdfUrlRef.current = pdfUrl;
      lastScaledHeightRef.current = scaleCalculations.scaledHeight;

      pdfViewerRef.current = (
        <PdfViewer
          height={scaleCalculations.scaledHeight}
          url={pdfUrl}
          pageNumber={1}
        />
      );
    }
  }, [pdfUrl, scaleCalculations.scaledHeight]);

  useEffect(() => {
    if (!pdfViewerRef.current) {
      pdfViewerRef.current = (
        <PdfViewer
          height={scaleCalculations.scaledHeight}
          url={pdfUrl}
          pageNumber={1}
        />
      );
    }
  }, []);

  // Debounced margin change callback with rate limiting
  const debouncedMarginsChange = useCallback(
    (newMargins: typeof margins) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Increase debounce time to reduce network calls
      debounceTimeoutRef.current = setTimeout(() => {
        if (
          isMountedRef.current &&
          onMarginsChange &&
          !isUpdatingFromPropsRef.current
        ) {
          console.log(
            'LayoutScaling: Calling onMarginsChange with:',
            newMargins,
          );
          onMarginsChange(newMargins);
        }
      }, 200); // Increased from 100ms to 200ms
    },
    [onMarginsChange],
  );

  // Sync display values when margins change from dragging
  useEffect(() => {
    if (
      !isInputFocused &&
      isMountedRef.current &&
      !isUpdatingFromPropsRef.current
    ) {
      setDisplayValues({
        top: String(Math.round(margins.top * 100) / 100),
        right: String(Math.round(margins.right * 100) / 100),
        bottom: String(Math.round(margins.bottom * 100) / 100),
        left: String(Math.round(margins.left * 100) / 100),
      });
    }
  }, [margins, isInputFocused]);

  // Optimized mouse move handler with better throttling
  const throttleRef = useRef<number>(0);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (
        !activeDrag ||
        !containerRef.current ||
        !interactive ||
        !isMountedRef.current
      )
        return;

      const now = Date.now();
      if (now - throttleRef.current < 32) return; // Reduced from 16ms to 32ms for better performance
      throttleRef.current = now;

      try {
        e.preventDefault();
        e.stopPropagation();

        const rect = containerRef.current.getBoundingClientRect();
        const newMargins = { ...margins };

        const relativeX =
          (e.clientX - rect.left - scaleCalculations.offsetX) /
          scaleCalculations.scale;
        const relativeY =
          (e.clientY - rect.top - scaleCalculations.offsetY) /
          scaleCalculations.scale;

        switch (activeDrag) {
          case 'top':
            newMargins.top = Math.max(
              0,
              Math.min(relativeY, pdfDimensions.height - margins.bottom - 1),
            );
            break;
          case 'right':
            newMargins.right = Math.max(
              0,
              Math.min(
                pdfDimensions.width - relativeX,
                pdfDimensions.width - margins.left - 1,
              ),
            );
            break;
          case 'bottom':
            newMargins.bottom = Math.max(
              0,
              Math.min(
                pdfDimensions.height - relativeY,
                pdfDimensions.height - margins.top - 1,
              ),
            );
            break;
          case 'left':
            newMargins.left = Math.max(
              0,
              Math.min(relativeX, pdfDimensions.width - margins.right - 1),
            );
            break;
        }

        setMargins(newMargins);

        // Only call debounced change on significant moves (reduces network calls)
        const significantChange = (
          Object.keys(newMargins) as Array<keyof typeof newMargins>
        ).some((key) => Math.abs(newMargins[key] - margins[key]) > 0.1);

        if (significantChange) {
          debouncedMarginsChange(newMargins);
        }
      } catch (error) {
        console.error('Error during drag:', error);
        setActiveDrag(null);
      }
    },
    [
      activeDrag,
      margins,
      scaleCalculations,
      pdfDimensions,
      interactive,
      debouncedMarginsChange,
    ],
  );

  const handleMouseUp = useCallback(() => {
    if (isMountedRef.current) {
      setActiveDrag(null);
      // Final callback on mouse up to ensure final state is captured
      if (onMarginsChange && !isUpdatingFromPropsRef.current) {
        onMarginsChange(margins);
      }
    }
  }, [margins, onMarginsChange]);

  useEffect(() => {
    if (activeDrag && interactive) {
      const handleMouseMoveWrapper = (e: MouseEvent) => {
        try {
          handleMouseMove(e);
        } catch (error) {
          console.error('Mouse move error:', error);
          setActiveDrag(null);
        }
      };

      const handleMouseUpWrapper = () => {
        try {
          handleMouseUp();
        } catch (error) {
          console.error('Mouse up error:', error);
          setActiveDrag(null);
        }
      };

      document.addEventListener('mousemove', handleMouseMoveWrapper, {
        passive: false,
      });
      document.addEventListener('mouseup', handleMouseUpWrapper);

      return () => {
        document.removeEventListener('mousemove', handleMouseMoveWrapper);
        document.removeEventListener('mouseup', handleMouseUpWrapper);
      };
    }
  }, [activeDrag, handleMouseMove, handleMouseUp, interactive]);

  const handleMouseDown = useCallback(
    (edge: keyof typeof initialMargins) => (e: React.MouseEvent) => {
      if (!interactive || !isMountedRef.current) return;
      try {
        e.preventDefault();
        e.stopPropagation();
        setActiveDrag(edge);
      } catch (error) {
        console.error('Error during mouse down:', error);
      }
    },
    [interactive],
  );

  // Optimized input change handler with debouncing
  const inputChangeTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleMarginChange = useCallback(
    (edge: keyof typeof margins, value: string) => {
      if (!isMountedRef.current) return;

      setDisplayValues((prev) => ({ ...prev, [edge]: value }));

      // Clear existing timeout for this edge
      if (inputChangeTimeoutRef.current[edge]) {
        clearTimeout(inputChangeTimeoutRef.current[edge]);
      }

      // Debounce the actual margin update
      inputChangeTimeoutRef.current[edge] = setTimeout(() => {
        const numValue = parseFloat(value);

        if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
          const finalValue = value === '' ? 0 : numValue;
          const maxMargin =
            edge === 'top' || edge === 'bottom'
              ? pdfDimensions.height - 1
              : pdfDimensions.width - 1;

          if (finalValue <= maxMargin) {
            const newMargins = {
              ...margins,
              [edge]: finalValue,
            };

            const contentWidth =
              pdfDimensions.width - newMargins.left - newMargins.right;
            const contentHeight =
              pdfDimensions.height - newMargins.top - newMargins.bottom;

            if (contentWidth > 1 && contentHeight > 1) {
              setMargins(newMargins);
              debouncedMarginsChange(newMargins);
            }
          }
        }
      }, 300); // 300ms debounce for input changes
    },
    [margins, pdfDimensions, debouncedMarginsChange],
  );

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(
    (edge: keyof typeof margins, value: string) => {
      if (!isMountedRef.current) return;

      setIsInputFocused(false);
      const numValue = parseFloat(value);

      if (isNaN(numValue) || value === '') {
        const currentValue = margins[edge];
        setDisplayValues((prev) => ({ ...prev, [edge]: String(currentValue) }));
      } else {
        const roundedValue = Math.round(numValue * 100) / 100;
        setDisplayValues((prev) => ({ ...prev, [edge]: String(roundedValue) }));

        // Final update on blur
        const newMargins = { ...margins, [edge]: roundedValue };
        setMargins(newMargins);
        if (onMarginsChange && !isUpdatingFromPropsRef.current) {
          onMarginsChange(newMargins);
        }
      }
    },
    [margins, onMarginsChange],
  );

  const contentArea = useMemo(
    () => ({
      width: pdfDimensions.width - margins.left - margins.right,
      height: pdfDimensions.height - margins.top - margins.bottom,
    }),
    [pdfDimensions, margins],
  );

  // NEW: Calculate positions and display values for edge labels
  const edgeDisplayValues = useMemo(() => {
    return {
      top: String(Math.round(margins.top * 100) / 100),
      right: String(Math.round(margins.right * 100) / 100),
      bottom: String(Math.round(margins.bottom * 100) / 100),
      left: String(Math.round(margins.left * 100) / 100),
    };
  }, [margins]);

  return (
    <Box w="100%">
      {/* Container with padding for external value displays */}
      <Box
        position="relative"
        w={`${containerWidth + 60}px`} // Extra width for left/right values
        h={`${containerHeight + 60}px`} // Extra height for top/bottom values
        mx="auto"
        py="30px"
        px="40px">
        {/* External edge value displays */}

        {showControls && (
          <>
            {/* Top value display - centered above container */}
            <EdgeValueDisplay
              position="absolute"
              top="-8px" // Increased distance for better visibility
              left="50%"
              transform="translateX(-50%)"
              borderBottom="2px solid #3b82f6" // Highlight active edge
            >
              {edgeDisplayValues.top}
            </EdgeValueDisplay>

            {/* Right value display - vertically centered to right */}
            <EdgeValueDisplay
              position="absolute"
              top="50%"
              right="8px" // Consistent with top/bottom positioning
              transform="translateY(-50%)"
              borderBottom="2px solid #3b82f6" // Highlight active edge
            >
              {edgeDisplayValues.right}
            </EdgeValueDisplay>

            {/* Bottom value display - centered below container */}
            <EdgeValueDisplay
              position="absolute"
              bottom="-8px" // Increased distance
              left="50%"
              transform="translateX(-50%)"
              borderBottom="2px solid #3b82f6" // Highlight active edge
            >
              {edgeDisplayValues.bottom}
            </EdgeValueDisplay>

            {/* Left value display - vertically centered to left */}
            <EdgeValueDisplay
              position="absolute"
              top="50%"
              left="34px" // Consistent with other offsets
              transform="translateY(-50%)"
              borderBottom="2px solid #3b82f6" // Highlight active edge
            >
              {edgeDisplayValues.left}
            </EdgeValueDisplay>
          </>
        )}

        {/* PDF Container */}
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
          <Box
            position="relative"
            w={`${scaleCalculations.scaledWidth}px`}
            h={`${scaleCalculations.scaledHeight}px`}>
            {/* PERFORMANCE FIX: Use stable PDF viewer reference */}
            {pdfViewerRef.current}

            {/* Margin handles */}
            <>
              {/* Top handle */}
              <MarginHandle
                isActive={activeDrag === 'top'}
                interactive={interactive}
                position="absolute"
                left="0"
                w="100%"
                h="5px"
                cursor={interactive ? 'ns-resize' : 'default'}
                top={`${margins.top * scaleCalculations.scale - 3}px`}
                zIndex="100"
                onMouseDown={handleMouseDown('top')}
              />

              {/* Right handle */}
              <MarginHandle
                isActive={activeDrag === 'right'}
                interactive={interactive}
                position="absolute"
                top="0"
                h="100%"
                w="5px"
                cursor={interactive ? 'ew-resize' : 'default'}
                left={`${(pdfDimensions.width - margins.right) * scaleCalculations.scale - 3}px`}
                zIndex="100"
                onMouseDown={handleMouseDown('right')}
              />

              {/* Bottom handle */}
              <MarginHandle
                isActive={activeDrag === 'bottom'}
                interactive={interactive}
                position="absolute"
                left="0"
                w="100%"
                h="5px"
                cursor={interactive ? 'ns-resize' : 'default'}
                top={`${(pdfDimensions.height - margins.bottom) * scaleCalculations.scale - 3}px`}
                zIndex="100"
                onMouseDown={handleMouseDown('bottom')}
              />

              {/* Left handle */}
              <MarginHandle
                isActive={activeDrag === 'left'}
                interactive={interactive}
                position="absolute"
                top="0"
                h="100%"
                w="5px"
                cursor={interactive ? 'ew-resize' : 'default'}
                left={`${margins.left * scaleCalculations.scale - 3}px`}
                zIndex="100"
                onMouseDown={handleMouseDown('left')}
              />
            </>
          </Box>
        </Box>
      </Box>

      {showControls && (
        <Box pl="xl">
          <Box
            borderBottom="1px solid #e2e8f0"
            marginTop="xxl"
            w="100%"
            maxWidth="259"
            mx="auto">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb="md"
              gap="sm">
              <Flex alignItems="center">
                <Text
                  fontSize="sm"
                  color="#64748b"
                  fontWeight="500"
                  minWidth="32px"
                  pr="xs">
                  Top
                </Text>
                <MarginValue>
                  <MarginInput
                    value={displayValues.top}
                    onChange={(e) => handleMarginChange('top', e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur('top', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max={pdfDimensions.height - 1}
                  />
                </MarginValue>
              </Flex>

              <Flex alignItems="center">
                <Text
                  fontSize="sm"
                  color="#64748b"
                  fontWeight="500"
                  minWidth="32px" // Reduced from 40px
                  pr="xs">
                  Bottom
                </Text>
                <MarginValue>
                  <MarginInput
                    value={displayValues.bottom}
                    onChange={(e) =>
                      handleMarginChange('bottom', e.target.value)
                    }
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur('bottom', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max={pdfDimensions.height - 1}
                  />
                </MarginValue>
              </Flex>
            </Flex>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb="lg"
              gap="sm">
              <Flex alignItems="center">
                <Text
                  fontSize="sm"
                  color="#64748b"
                  fontWeight="500"
                  minWidth="32px"
                  pr="xs">
                  Left
                </Text>
                <MarginValue>
                  <MarginInput
                    value={displayValues.left}
                    onChange={(e) => handleMarginChange('left', e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur('left', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max={pdfDimensions.width - 1}
                  />
                </MarginValue>
              </Flex>

              <Flex alignItems="center">
                <Text
                  fontSize="sm"
                  color="#64748b"
                  fontWeight="500"
                  minWidth="32px"
                  pr="xs">
                  Right
                </Text>
                <MarginValue>
                  <MarginInput
                    value={displayValues.right}
                    onChange={(e) =>
                      handleMarginChange('right', e.target.value)
                    }
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur('right', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max={pdfDimensions.width - 1}
                  />
                </MarginValue>
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}
      <Flex
        justifyContent="space-between"
        mt="xs"
        mx="auto"
        w="260px"
        ml="88px">
        <Text fontSize="sm" fontWeight="500" color=" #475569">
          Content area
        </Text>
        <Text fontSize="sm" fontWeight="500" color=" #475569">
          {contentArea.width.toFixed(2)} × {contentArea.height.toFixed(2)} cm
        </Text>
      </Flex>
    </Box>
  );
};

export default LayoutScaling;
