import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormFieldsSchema, FormFieldsType } from 'schemas/formField';

import { FormField } from './FormFieldTypes';

interface UseFormValidationProps {
  items: FormField[];
  setItems: React.Dispatch<React.SetStateAction<FormField[]>>;
}

export const useFormValidation = ({
  items,
  setItems,
}: UseFormValidationProps) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm<FormFieldsType>({
    resolver: zodResolver(FormFieldsSchema),
    defaultValues: {
      ...items,
    },
  });

  // Update form when items change
  useEffect(() => {
    reset(items);
  }, [items, reset]);

  // Validate field names (unique and capitalized)
  const validateFieldNames = (): boolean => {
    // Check for empty field names
    const emptyFields = items.filter((item) => !item.name);
    if (emptyFields.length > 0) {
      updateItemsWithErrors(
        emptyFields.map((f) => f.id),
        'Field label is required',
      );
      return false;
    }

    // Check for lowercase first letter
    const lowercaseFields = items.filter(
      (item) =>
        item.name && item.name.charAt(0) !== item.name.charAt(0).toUpperCase(),
    );
    if (lowercaseFields.length > 0) {
      updateItemsWithErrors(
        lowercaseFields.map((f) => f.id),
        'Field label must start with an uppercase letter',
      );
      return false;
    }

    // Check for duplicate names
    const names = items.map((item) => item.name.toLowerCase());
    const uniqueNames = new Set(names);

    if (uniqueNames.size !== names.length) {
      // Find duplicate names
      const duplicates: Record<string, string[]> = {};
      items.forEach((item) => {
        const lowerName = item.name.toLowerCase();
        duplicates[lowerName] = duplicates[lowerName] || [];
        duplicates[lowerName].push(item.id);
      });

      // Mark fields with duplicate names
      const duplicateIds: string[] = [];
      Object.values(duplicates).forEach((ids) => {
        if (ids.length > 1) {
          duplicateIds.push(...ids);
        }
      });

      updateItemsWithErrors(duplicateIds, 'Field label must be unique');
      return false;
    }

    return true;
  };

  // Validate option fields
  const validateOptionFields = (): boolean => {
    const optionFields = items.filter(
      (item) => item.type === 'options' || item.type === 'Radio Button',
    );

    // Check for empty options
    for (const field of optionFields) {
      if (!field.values || field.values.length === 0) {
        updateItemsWithErrors(
          [field.id],
          `${field.name} requires at least one option`,
        );
        return false;
      }

      // Check for empty option names
      const emptyOptions = field.values.some((value) => !value.name);
      if (emptyOptions) {
        updateItemsWithErrors(
          [field.id],
          `All options in ${field.name} require a name`,
        );
        return false;
      }
    }

    return true;
  };

  // Update items with validation errors
  const updateItemsWithErrors = (itemIds: string[], errorMessage: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        itemIds.includes(item.id)
          ? { ...item, error: errorMessage }
          : { ...item, error: undefined },
      ),
    );
  };

  // Clear all validation errors
  const clearValidationErrors = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, error: undefined })),
    );
  };

  // Validate the entire form
  const validateForm = (): boolean => {
    clearValidationErrors();

    // Run all validations
    const isNamesValid = validateFieldNames();
    if (!isNamesValid) return false;

    const areOptionsValid = validateOptionFields();
    if (!areOptionsValid) return false;

    return true;
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    getValues,
    reset,
    trigger,
    validateForm,
    validateFieldNames,
    validateOptionFields,
    clearValidationErrors,
    validationErrors,
  };
};

export default useFormValidation;
