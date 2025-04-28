import { useState } from "react";
import { Box, Button, Flex, Select, Text } from "@wraft/ui";

interface Counterparty {
  id: string;
  name: string;
  email: string;
}

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (counterparty: Counterparty) => void;
  counterparties: Counterparty[];
}

export const AssignModal = ({
  isOpen,
  onClose,
  onSubmit,
  counterparties,
}: AssignModalProps) => {
  const [selectedCounterparty, setSelectedCounterparty] = useState<string>("");

  const handleSelectChange = (e: any) => {
    console.log(e);
    // setSelectedCounterparty(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const counterparty = counterparties.find(
      (c) => c.id === selectedCounterparty,
    );
    if (counterparty) {
      onSubmit(counterparty);
      setSelectedCounterparty("");
    }
  };

  if (!isOpen) return null;

  return (
    <Box>
      <Text variant="lg" fontWeight="heading" m="lg">
        Add Assignee
      </Text>
      <form onSubmit={handleFormSubmit}>
        <Flex direction="column" gap="md" mx="lg">
          <Select
            value={selectedCounterparty}
            onChange={handleSelectChange}
            required
            options={[
              { value: "", label: "Select a Signer" },
              ...counterparties.map((counterparty) => ({
                value: counterparty.id,
                label: `${counterparty.name} (${counterparty.email})`,
              })),
            ]}
          />
          <Box py="lg">
            <Button type="submit">Assign</Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};
