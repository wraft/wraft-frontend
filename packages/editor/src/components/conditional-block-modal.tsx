import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Modal, Box, Flex, Button, Text, InputText, Select } from "@wraft/ui";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { CloseIcon } from "@wraft/icon";
import type { ConditionalBlockAttrs } from "../extensions/conditional-block/conditional-block-spec";
import { getMachineName } from "../lib/utils";

interface ConditionalBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (attrs: ConditionalBlockAttrs) => void;
  fields: any[];
  existingAttrs?: ConditionalBlockAttrs;
}

const OPERATIONS = [
  { value: "equal", label: "Equal (=)" },
  { value: "not_equal", label: "Not Equal (≠)" },
  { value: "like", label: "Like (contains)" },
  { value: "not_like", label: "Not Like (does not contain)" },
  { value: "greater_than", label: "Greater Than (>)" },
  { value: "greater_than_or_equal", label: "Greater Than or Equal (≥)" },
  { value: "less_than", label: "Less Than (<)" },
  { value: "less_than_or_equal", label: "Less Than or Equal (≤)" },
];

interface ConditionalBlockFormData {
  conditions: {
    placeholder: string;
    operation: string;
    value: string;
    logic?: "and" | "or";
    machineName?: string | null;
  }[];
}

export default function ConditionalBlockModal({
  isOpen,
  onClose,
  onInsert,
  fields,
  existingAttrs,
}: ConditionalBlockModalProps) {
  const fieldsArray = Array.isArray(fields) ? fields : [];
  const filteredFields = fieldsArray.filter((field: any) => {
    const fieldType =
      field.type ||
      field.fieldType ||
      (typeof field.field_type === "object"
        ? field.field_type?.name
        : field.field_type);
    return fieldType !== "Table" && fieldType !== "table";
  });

  const defaultValues: ConditionalBlockFormData = existingAttrs
    ? {
        conditions:
          existingAttrs.conditions.length > 0
            ? existingAttrs.conditions.map((cond, idx) => ({
                ...cond,
                logic: idx === 0 ? undefined : cond.logic || "and",
              }))
            : [
                {
                  placeholder: "",
                  operation: "equal",
                  value: "",
                },
              ],
      }
    : {
        conditions: [
          {
            placeholder: "",
            operation: "equal",
            value: "",
          },
        ],
      };

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<ConditionalBlockFormData>({
    defaultValues,
  });

  const {
    fields: conditionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "conditions",
  });

  useEffect(() => {
    if (isOpen) {
      const values: ConditionalBlockFormData = existingAttrs
        ? {
            conditions:
              existingAttrs.conditions.length > 0
                ? existingAttrs.conditions.map((cond, idx) => ({
                    ...cond,
                    logic: idx === 0 ? undefined : cond.logic || "and",
                  }))
                : [
                    {
                      placeholder: "",
                      operation: "equal",
                      value: "",
                    },
                  ],
          }
        : {
            conditions: [
              {
                placeholder: "",
                operation: "equal",
                value: "",
              },
            ],
          };
      reset(values);
    }
  }, [isOpen, existingAttrs, reset]);

  const onSubmit = (data: ConditionalBlockFormData) => {
    const allPlaceholdersValid = data.conditions.every((cond) =>
      fields.some((field) => field.name === cond.placeholder),
    );

    if (!allPlaceholdersValid) {
      return;
    }

    const attrs: ConditionalBlockAttrs = {
      conditions: data.conditions.map((cond, idx) => {
        // Find the field to get its machine_name
        const selectedField = filteredFields.find(
          (field: any) => (field.name || field.label) === cond.placeholder,
        );
        const machineName = getMachineName(selectedField);

        return {
          placeholder: cond.placeholder,
          operation: cond.operation,
          value: cond.value,
          ...(idx > 0 && { logic: cond.logic || "and" }),
          ...(machineName && { machineName }),
        };
      }),
    };

    onInsert(attrs);
  };

  const addCondition = () => {
    append({
      placeholder: "",
      operation: "equal",
      value: "",
      logic: "and",
    });
  };

  const removeCondition = (index: number) => {
    if (conditionFields.length > 1) {
      remove(index);
    }
  };

  if (!isOpen) return null;

  if (fields.length === 0) {
    return (
      <Modal
        open={isOpen}
        ariaLabel="Create Conditional Block"
        onClose={onClose}
        size="md"
      >
        <Box w="600px" m="-xl">
          <Flex
            justify="space-between"
            align="center"
            p="lg"
            borderBottom="1px solid"
            borderColor="border"
          >
            <Text fontSize="lg" fontWeight="heading">
              Conditional Block
            </Text>
            <Box onClick={onClose} cursor="pointer">
              <CloseIcon color="#2C3641" />
            </Box>
          </Flex>

          <Box p="lg">
            <Text color="text-secondary">
              No placeholders are available. Please add fields to your document
              template first.
            </Text>
          </Box>

          <Flex
            justify="flex-end"
            align="center"
            p="md"
            borderTop="1px solid"
            borderColor="border"
            gap="md"
          >
            <Button onClick={onClose}>Close</Button>
          </Flex>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={isOpen}
      ariaLabel="Create Conditional Block"
      onClose={onClose}
      size="md"
    >
      <Box w="600px" m="-xl">
        <Flex
          justify="space-between"
          align="center"
          p="lg"
          borderBottom="1px solid"
          borderColor="border"
        >
          <Text fontSize="lg" fontWeight="heading">
            {existingAttrs
              ? "Edit Conditional Block"
              : "Create Conditional Block"}
          </Text>
          <Box onClick={onClose} cursor="pointer">
            <CloseIcon className="icon-primary" />
          </Box>
        </Flex>

        <Box p="lg" overflowY="auto" maxHeight="60vh">
          <Box mb="lg">
            <Text fontSize="sm" color="text-secondary" mb="md">
              This block will only be included when all conditions are met.
            </Text>

            <Box
              p="md"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              backgroundColor="gray.50"
            >
              <Flex direction="column" gap="sm">
                {conditionFields.map((field, index) => (
                  <Box key={field.id}>
                    {index > 0 && (
                      <Flex justify="center" align="center" my="sm">
                        <Controller
                          name={`conditions.${index}.logic`}
                          control={control}
                          defaultValue="and"
                          render={({ field: controllerField }) => (
                            <Flex gap="xs">
                              <Button
                                size="xs"
                                variant={
                                  (controllerField.value || "and") === "and"
                                    ? "primary"
                                    : "secondary"
                                }
                                onClick={() => controllerField.onChange("and")}
                                style={{ minWidth: "40px" }}
                              >
                                AND
                              </Button>
                              <Button
                                size="xs"
                                variant={
                                  controllerField.value === "or"
                                    ? "primary"
                                    : "secondary"
                                }
                                onClick={() => controllerField.onChange("or")}
                                style={{ minWidth: "40px" }}
                              >
                                OR
                              </Button>
                            </Flex>
                          )}
                        />
                      </Flex>
                    )}
                    <Flex
                      gap="sm"
                      align="flex-start"
                      flex="1"
                      minWidth="300px"
                      wrap="wrap"
                    >
                      <Box flex="1" minWidth="120px">
                        <Controller
                          name={`conditions.${index}.placeholder`}
                          control={control}
                          rules={{
                            required: "Required",
                            validate: (value) =>
                              filteredFields.some(
                                (f: any) => (f.name || f.label) === value,
                              ) || "Invalid",
                          }}
                          render={({ field: controllerField }) => (
                            <Select
                              options={[
                                { value: "", label: "Placeholder" },
                                ...filteredFields.map((field: any) => ({
                                  value: field.name || field.label || "",
                                  label: field.name || field.label || "",
                                })),
                              ]}
                              value={controllerField.value || undefined}
                              onChange={(selectedValue) => {
                                const value = String(
                                  Array.isArray(selectedValue)
                                    ? selectedValue[0] || ""
                                    : selectedValue || "",
                                );
                                controllerField.onChange(value);
                              }}
                              placeholder="Placeholder"
                            />
                          )}
                        />
                        {errors.conditions?.[index]?.placeholder && (
                          <Text fontSize="xs" color="error" mt="xs">
                            {errors.conditions[index].placeholder.message}
                          </Text>
                        )}
                      </Box>

                      <Box flex="1" minWidth="140px">
                        <Controller
                          name={`conditions.${index}.operation`}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select
                              options={OPERATIONS.map((op) => ({
                                value: op.value,
                                label: op.label,
                              }))}
                              value={controllerField.value || undefined}
                              onChange={(selectedValue) => {
                                const value = String(
                                  Array.isArray(selectedValue)
                                    ? selectedValue[0] || ""
                                    : selectedValue || "",
                                );
                                controllerField.onChange(value);
                              }}
                            />
                          )}
                        />
                      </Box>

                      <Box flex="1" minWidth="120px">
                        <InputText
                          type="text"
                          placeholder="Value"
                          {...register(`conditions.${index}.value`, {
                            required: "Required",
                          })}
                        />
                        {errors.conditions?.[index]?.value && (
                          <Text fontSize="xs" color="error" mt="xs">
                            {errors.conditions[index].value.message}
                          </Text>
                        )}
                      </Box>

                      {conditionFields.length > 1 && (
                        <Box flexShrink={0} pt="xs">
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => removeCondition(index)}
                          >
                            <TrashIcon size={12} />
                          </Button>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Flex>

              <Box mt="md">
                <Button size="sm" variant="secondary" onClick={addCondition}>
                  <PlusIcon size={14} weight="bold" />
                  Add Condition
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Flex
          justify="flex-end"
          align="center"
          p="md"
          borderTop="1px solid"
          borderColor="border"
          gap="md"
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
          >
            {existingAttrs
              ? "Update Conditional Block"
              : "Insert Conditional Block"}
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
}
