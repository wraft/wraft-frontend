# Wraft Design System

## Direction & Feel

Document lifecycle management tool for operations/business admins. Interfaces should feel **organized, scannable, professional** — like a well-structured record system. Quiet structure, clear hierarchy. No decoration for decoration's sake.

Reference: Linear's detail views, Vercel's dashboard subtlety.

## Depth Strategy

**Borders-only.** No box shadows. All containers use:

```
border="1px solid"
borderColor="border"
borderRadius="md"
bg="background-primary"
overflow="hidden"
```

Elevation is communicated through border separation, not shadow lift.

## Spacing

Base unit: Wraft's existing theme scale.

- **Micro**: `xs` (4px) — icon gaps, label-to-value
- **Component**: `sm` (8px) — within rows, section headers
- **Section**: `md` (12px) — between groups, card padding inner
- **Card padding**: `lg` (16px) — outer card padding
- **Major**: `xl` (24px) — between columns, between sections
- **Page**: `xxl` (32px) — PageInner horizontal padding

## Token Usage (Dark Mode Safe)

Always use semantic tokens. Never hardcode colors.

| Purpose          | Token                  | Light   | Dark    |
| ---------------- | ---------------------- | ------- | ------- |
| Card/surface bg  | `background-primary`   | #fff    | #111111 |
| Page canvas      | `background-secondary` | #f6f9f9 | #181a19 |
| Primary text     | `text-primary`         | #17221f | #fff    |
| Secondary text   | `text-secondary`       | #7a8481 | #747e7b |
| Borders          | `border`               | #e5e9e8 | #2d3231 |
| Accent/brand     | `primary`              | #127D5D | #127D5D |
| Placeholder bg   | `green.300`            | #e3f7ee | #0e2d22 |
| Placeholder icon | `green.900`            | #127d5d | #127d5d |

**Never use**: `bg="white"`, `bg="gray.50"`, `color="blue.600"`, `boxShadow="sm"`, or any hardcoded hex in components.

## Detail Page Pattern

Two-column grid layout for detail/profile pages:

```tsx
<Box display="grid" gridTemplateColumns="1fr 320px" gap="xl">
  <Box minW={0}>{/* Main content */}</Box>
  <Box>{/* Sidebar stats/metadata */}</Box>
</Box>
```

### Profile Header

Compact identity section above tabs. 48px avatar (or themed placeholder), name as `variant="lg"`, subtitle in `text-secondary`.

```tsx
<Flex gap="md" align="center" mb="md">
  {/* 48x48 logo or placeholder */}
  <Box>
    <Text variant="lg" fontWeight="600">
      {name}
    </Text>
    <Text fontSize="sm" color="text-secondary">
      {subtitle}
    </Text>
  </Box>
</Flex>
```

### Placeholder Avatar

When no image exists, use a themed square with an icon:

```tsx
<Flex
  w="48px"
  h="48px"
  borderRadius="md"
  bg="green.300"
  align="center"
  justify="center"
  color="green.900"
  flexShrink={0}
>
  <IconComponent size={20} />
</Flex>
```

## Sectioned Card Pattern

Single bordered card with multiple sections separated by internal borders. Each section has a header label and content area.

```tsx
<Box
  border="1px solid"
  borderColor="border"
  borderRadius="md"
  bg="background-primary"
  overflow="hidden"
>
  {/* First section — no borderTop */}
  <Box>
    <Box px="lg" py="sm">
      <Text fontSize="sm" fontWeight="600" color="text-secondary">
        Section Title
      </Text>
    </Box>
    <Box px="lg" pb="lg">
      {/* Content */}
    </Box>
  </Box>

  {/* Subsequent sections — borderTop as divider */}
  <Box borderTop="1px solid" borderColor="border">
    <Box px="lg" py="sm">
      <Text fontSize="sm" fontWeight="600" color="text-secondary">
        Next Section
      </Text>
    </Box>
    <Box px="lg" pb="lg">
      {/* Content */}
    </Box>
  </Box>
</Box>
```

## Definition List (DetailItem) Pattern

Label-above-value pairs for structured data. Use in a 2-column grid.

```tsx
const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <Box>
      <Text fontSize="sm" color="text-secondary" mb="xs">
        {label}
      </Text>
      <Text fontSize="sm2">{value}</Text>
    </Box>
  );
};

// Usage in a grid:
<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="md">
  <DetailItem label="Email" value={data.email} />
  <DetailItem label="Phone" value={data.phone} />
</Box>;
```

## Compact Stats Panel Pattern

Vertical list of label-value rows inside a bordered card. Used as sidebar content.

```tsx
<Box
  border="1px solid"
  borderColor="border"
  borderRadius="md"
  bg="background-primary"
  overflow="hidden"
>
  <Box px="lg" py="sm" borderBottom="1px solid" borderColor="border">
    <Text fontSize="sm" fontWeight="600" color="text-secondary">
      Panel Title
    </Text>
  </Box>
  <Box>
    {items.map((item, i) => (
      <Flex
        key={item.label}
        justify="space-between"
        align="center"
        px="lg"
        py="sm"
        borderBottom={i < items.length - 1 ? "1px solid" : "none"}
        borderColor="border"
      >
        <Text fontSize="sm" color="text-secondary">
          {item.label}
        </Text>
        <Text fontSize="sm2" fontWeight="600">
          {item.value}
        </Text>
      </Flex>
    ))}
  </Box>
</Box>
```

## Table Pattern

Wrap tables in a bordered container for visual consistency:

```tsx
<Box
  border="1px solid"
  borderColor="border"
  borderRadius="md"
  overflow="hidden"
>
  <Table data={data} columns={columns} />
</Box>
```

## Delete Confirmation Modal

Keep it concise. One sentence, two buttons.

```tsx
<Box p="xl">
  <Text fontSize="base" fontWeight="600" mb="md">
    Delete {thing}
  </Text>
  <Text fontSize="sm2" color="text-secondary" mb="lg">
    Are you sure you want to delete{" "}
    <Text as="span" fontWeight="600" color="text-primary">
      {name}
    </Text>
    ? This action cannot be undone.
  </Text>
  <Flex gap="sm" justify="flex-end">
    <Button variant="secondary" size="sm">
      Cancel
    </Button>
    <Button variant="primary" size="sm" danger>
      Delete
    </Button>
  </Flex>
</Box>
```

## Typography Hierarchy (within detail pages)

| Role              | Size             | Weight | Color                  |
| ----------------- | ---------------- | ------ | ---------------------- |
| Page/profile name | `variant="lg"`   | 600    | text-primary (default) |
| Section header    | `fontSize="sm"`  | 600    | text-secondary         |
| Detail label      | `fontSize="sm"`  | 400    | text-secondary         |
| Detail value      | `fontSize="sm2"` | 400    | text-primary (default) |
| Stat value        | `fontSize="sm2"` | 600    | text-primary (default) |
| Stat label        | `fontSize="sm"`  | 400    | text-secondary         |
| Count/meta        | `fontSize="sm2"` | 600    | text-secondary         |

## Loading States

Use proportional spinners, not full-viewport. Keep surrounding layout (sidebar, header) visible.

```tsx
// Inside a content area:
<Flex align="center" justify="center" py="3xl">
  <Spinner size={24} />
</Flex>

// Page-level (keeps sidebar visible):
<Page>
  <Flex align="center" justify="center" py="3xl">
    <Spinner size={24} />
  </Flex>
</Page>
```

## What to Avoid

- `bg="white"` — use `bg="background-primary"`
- `boxShadow` on cards — use borders
- Decorative icons next to text labels (MapPin next to "city", Calendar next to "created") — they add clutter, not clarity
- Redundant headings inside tabs that repeat the tab name
- Verbose delete confirmations with bullet lists
- `h="100vh"` on loading spinners inside content areas
- Multiple separate cards for sparse data — combine into one sectioned card
