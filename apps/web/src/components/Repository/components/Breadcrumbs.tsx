import React from 'react';
import { Text, Button, Flex } from '@wraft/ui';
import { CaretRight, House } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';

import { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = React.memo(
  ({ items, onNavigate }) => {
    return (
      <Flex alignItems="center" mb="4" gap="2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onNavigate('root')}
          aria-label="Go to Home"
          tabIndex={0}>
          <IconFrame>
            <House size={14} />
          </IconFrame>
        </Button>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <Flex key={item.id} alignItems="center" gap="xs">
              <IconFrame>
                <CaretRight size={13} />
              </IconFrame>
              {isLastItem ? (
                // Current folder - non-clickable, different styling
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="bold"
                  color="text-secondary"
                  aria-label={`Current folder: ${item.name}`}
                  tabIndex={0}>
                  {item.name}
                </Text>
              ) : (
                // Navigable breadcrumb item
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onNavigate(item.id)}
                  aria-label={`Go to ${item.name}`}
                  tabIndex={0}>
                  <Text as="span" fontSize="sm" fontWeight="bold">
                    {item.name}
                  </Text>
                </Button>
              )}
            </Flex>
          );
        })}
      </Flex>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
