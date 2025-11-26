import { useState, useEffect } from "react";
import styled from "@xstyled/emotion";
import { PlusIcon, TrashIcon, TableIcon, EyeIcon } from "@phosphor-icons/react";
import {
  Modal,
  Box,
  Flex,
  Button,
  Text,
  Field,
  InputText,
  Textarea,
  Tab,
  useTab,
} from "@wraft/ui";
import { CloseIcon } from "@wraft/icon";
import type { SmartTableData, SmartTableJSON } from "../helpers/smart-table";
import {
  parseAndValidateJSON,
  smartTableDataToJSON,
  generateEmptySmartTableData,
} from "../helpers/smart-table";

interface SmartTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableJSON: SmartTableJSON, tableName: string) => void;
  existingData?: {
    name: string;
    data: SmartTableData;
  };
}

// Styled components for tables (not available in wraft UI)
const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th,
  td {
    border: 1px solid #d1d5db;
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr[data-footer="true"] td {
    background-color: #f9fafb;
    font-weight: 500;
  }
`;

const ManualTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  th,
  td {
    border: 1px solid #d1d5db;
    padding: 0.25rem;
  }

  th {
    background-color: #f3f4f6;
  }

  input {
    width: 100%;
    border: none;
    padding: 0.5rem;
    font-size: 0.875rem;
    background: transparent;

    &:focus {
      outline: 2px solid #3b82f6;
      outline-offset: -2px;
    }
  }
`;

export default function SmartTableModal({
  isOpen,
  onClose,
  onSubmit,
  existingData,
}: SmartTableModalProps) {
  const [tableName, setTableName] = useState("");
  const tab = useTab({ defaultSelectedId: "json" });
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewData, setPreviewData] = useState<SmartTableData | null>(null);

  // Manual creation state
  const [manualData, setManualData] = useState<SmartTableData>(
    generateEmptySmartTableData(2, 3),
  );

  useEffect(() => {
    if (isOpen) {
      // Reset or load existing data
      if (existingData) {
        setTableName(existingData.name);
        setManualData(existingData.data);
        setJsonInput(JSON.stringify(existingData.data, null, 2));
        setPreviewData(existingData.data);
      } else {
        setTableName("");
        setJsonInput("");
        setError("");
        setSuccess("");
        setPreviewData(null);
        setManualData(generateEmptySmartTableData(2, 3));
      }
    }
  }, [isOpen, existingData]);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setError("");
    setSuccess("");
    setPreviewData(null);
  };

  const handlePreview = () => {
    const { data, error: parseError } = parseAndValidateJSON(jsonInput);
    if (parseError) {
      setError(parseError);
      setPreviewData(null);
    } else if (data) {
      setError("");
      setSuccess("✓ Valid JSON format");
      setPreviewData(data);
    }
  };

  const handleSubmit = () => {
    if (!tableName.trim()) {
      setError("Please enter a table name");
      return;
    }

    let dataToSubmit: SmartTableData;

    if (activeTab === "json") {
      const { data, error: parseError } = parseAndValidateJSON(jsonInput);
      if (parseError) {
        setError(parseError);
        return;
      }
      if (!data) {
        setError("Invalid JSON data");
        return;
      }
      dataToSubmit = data;
    } else {
      dataToSubmit = manualData;
    }

    const tableJSON = smartTableDataToJSON(dataToSubmit, tableName);
    onSubmit(tableJSON, tableName);
    // Note: modal closing is handled by parent component after successful insertion
  };

  // Manual table handlers
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...manualData.headers];
    newHeaders[index] = value;
    setManualData({ ...manualData, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...manualData.rows];
    newRows[rowIndex][colIndex] = value;
    setManualData({ ...manualData, rows: newRows });
  };

  const updateFooter = (index: number, value: string) => {
    if (!manualData.footer) {
      const footer = Array(manualData.headers.length).fill("");
      footer[index] = value;
      setManualData({ ...manualData, footer });
    } else {
      const newFooter = [...manualData.footer];
      newFooter[index] = value;
      setManualData({ ...manualData, footer: newFooter });
    }
  };

  const addColumn = () => {
    const newHeaders = [
      ...manualData.headers,
      `Column ${manualData.headers.length + 1}`,
    ];
    const newRows = manualData.rows.map((row) => [...row, ""]);
    const newFooter = manualData.footer
      ? [...manualData.footer, ""]
      : undefined;
    setManualData({
      ...manualData,
      headers: newHeaders,
      rows: newRows,
      footer: newFooter,
    });
  };

  const removeColumn = (index: number) => {
    if (manualData.headers.length <= 1) return;
    const newHeaders = manualData.headers.filter((_, i) => i !== index);
    const newRows = manualData.rows.map((row) =>
      row.filter((_, i) => i !== index),
    );
    const newFooter = manualData.footer
      ? manualData.footer.filter((_, i) => i !== index)
      : undefined;
    setManualData({
      ...manualData,
      headers: newHeaders,
      rows: newRows,
      footer: newFooter,
    });
  };

  const addRow = () => {
    const newRow = Array(manualData.headers.length).fill("");
    setManualData({ ...manualData, rows: [...manualData.rows, newRow] });
  };

  const removeRow = (index: number) => {
    if (manualData.rows.length <= 1) return;
    const newRows = manualData.rows.filter((_, i) => i !== index);
    setManualData({ ...manualData, rows: newRows });
  };

  const toggleFooter = () => {
    if (manualData.footer) {
      setManualData({ ...manualData, footer: undefined });
    } else {
      setManualData({
        ...manualData,
        footer: Array(manualData.headers.length).fill(""),
      });
    }
  };

  const activeTab = tab.useState("selectedId") || "json";

  if (!isOpen) return null;

  const exampleJSON = {
    headers: ["Product", "Quantity", "Price"],
    rows: [
      ["Item A", "2", "$100"],
      ["Item B", "1", "$50"],
    ],
    footer: ["Total", "3", "$150"],
  };

  return (
    <Modal
      open={isOpen}
      ariaLabel={existingData ? "Edit Smart Table" : "Create Smart Table"}
      onClose={onClose}
      size="lg"
    >
      <Box w="800px" m="-xl">
        <Flex
          justify="space-between"
          align="center"
          p="lg"
          borderBottom="1px solid"
          borderColor="border"
        >
          <Flex align="center" gap="sm">
            <TableIcon size={24} />
            <Text fontSize="lg" fontWeight="heading">
              {existingData ? "Edit Smart Table" : "Create Smart Table"}
            </Text>
          </Flex>
          <Box onClick={onClose} cursor="pointer">
            <CloseIcon color="#2C3641" />
          </Box>
        </Flex>

        <Box p="lg" overflowY="auto" maxHeight="55vh">
          <Box mb="lg">
            <Field
              label="Table Name *"
              hint="A unique identifier for this table"
            >
              <InputText
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="e.g., invoice-items, user-list"
              />
            </Field>
          </Box>

          <Tab.List aria-label="Table Creation Tabs" store={tab} mb="lg">
            <Tab id="json" store={tab}>
              Import from JSON
            </Tab>
            <Tab id="manual" store={tab}>
              Create Manually
            </Tab>
          </Tab.List>

          <Tab.Panel store={tab} tabId="json">
            <Box>
              <Box mb="lg">
                <Field
                  label="JSON Data"
                  hint="Paste your JSON with headers, rows, and optional footer"
                >
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder={JSON.stringify(exampleJSON, null, 2)}
                    minRows={15}
                    style={{ fontFamily: "monospace" }}
                  />
                </Field>
              </Box>

              <Box
                mb="md"
                p="sm"
                backgroundColor="#1f2937"
                color="#f3f4f6"
                borderRadius="sm"
                fontSize="sm"
                overflowX="auto"
              >
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(exampleJSON, null, 2)}
                </pre>
              </Box>

              <Box mb="md">
                <Button size="sm" variant="secondary" onClick={handlePreview}>
                  <EyeIcon size={16} />
                  Preview Table
                </Button>
              </Box>

              {error && (
                <Box
                  mb="md"
                  p="sm"
                  color="#dc2626"
                  backgroundColor="#fef2f2"
                  border="1px solid"
                  borderColor="#fecaca"
                  borderRadius="sm"
                  fontSize="sm"
                >
                  {error}
                </Box>
              )}
              {success && (
                <Box
                  mb="md"
                  p="sm"
                  color="#059669"
                  backgroundColor="#d1fae5"
                  border="1px solid"
                  borderColor="#a7f3d0"
                  borderRadius="sm"
                  fontSize="sm"
                >
                  {success}
                </Box>
              )}

              {previewData && (
                <Box
                  mt="md"
                  p="md"
                  backgroundColor="#f9fafb"
                  border="1px solid"
                  borderColor="#e5e7eb"
                  borderRadius="sm"
                  overflowX="auto"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb="sm"
                    color="#374151"
                  >
                    Preview:
                  </Text>
                  <PreviewTable>
                    <thead>
                      <tr>
                        {previewData.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                      {previewData.footer && (
                        <tr data-footer="true">
                          {previewData.footer.map((cell, i) => (
                            <td key={i}>{cell}</td>
                          ))}
                        </tr>
                      )}
                    </tbody>
                  </PreviewTable>
                </Box>
              )}
            </Box>
          </Tab.Panel>

          <Tab.Panel store={tab} tabId="manual">
            <Box>
              <Flex gap="sm" mb="md">
                <Button size="sm" variant="secondary" onClick={addColumn}>
                  <PlusIcon size={16} weight="bold" />
                  Add Column
                </Button>
                <Button size="sm" variant="secondary" onClick={addRow}>
                  <PlusIcon size={16} weight="bold" />
                  Add Row
                </Button>
                <Button size="sm" variant="secondary" onClick={toggleFooter}>
                  {manualData.footer ? "Remove" : "Add"} Footer
                </Button>
              </Flex>

              <ManualTable>
                <Box as="thead">
                  <Box as="tr">
                    {manualData.headers.map((header, i) => (
                      <Box as="th" key={i}>
                        <InputText
                          type="text"
                          value={header}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          placeholder={`Header ${i + 1}`}
                          transparent
                          style={{
                            border: "none",
                            padding: "0.5rem",
                            background: "transparent",
                          }}
                        />
                        {manualData.headers.length > 1 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => removeColumn(i)}
                            style={{ marginTop: "0.25rem" }}
                          >
                            <TrashIcon size={14} />
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  {manualData.rows.map((row, rowIndex) => (
                    <Box as="tr" key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>
                          <InputText
                            type="text"
                            value={cell}
                            onChange={(e) =>
                              updateCell(rowIndex, colIndex, e.target.value)
                            }
                            placeholder="Enter value"
                            transparent
                            style={{
                              border: "none",
                              padding: "0.5rem",
                              background: "transparent",
                            }}
                          />
                        </td>
                      ))}
                    </Box>
                  ))}
                </Box>
                {manualData.footer && (
                  <Box as="tfoot">
                    <Box as="tr">
                      {manualData.footer.map((cell, i) => (
                        <Box as="td" key={i}>
                          <InputText
                            type="text"
                            value={cell}
                            onChange={(e) => updateFooter(i, e.target.value)}
                            placeholder="Footer value"
                            transparent
                            style={{
                              border: "none",
                              padding: "0.5rem",
                              background: "transparent",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </ManualTable>

              {manualData.rows.length > 1 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => removeRow(manualData.rows.length - 1)}
                >
                  <TrashIcon size={16} />
                  Remove Last Row
                </Button>
              )}
            </Box>
          </Tab.Panel>
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
          <Button onClick={handleSubmit}>
            {existingData ? "Update Table" : "Create Table"}
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
}
