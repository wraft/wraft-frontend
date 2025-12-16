export function getRandomColor() {
  const colors = [
    "#F43F5E",
    "#22D3EE",
    "#8cf3be",
    "#C084FC",
    "#10B981",
    "#2cdc96",
    "#F59E0B",
    "#8B5CF6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getUserColor(userId: string | null | undefined): string {
  const colors = [
    "#F43F5E",
    "#22D3EE",
    "#8cf3a4",
    "#C084FC",
    "#10B981",
    "#2cdc96",
    "#F59E0B",
    "#8B5CF6",
  ];

  if (!userId) {
    return colors[0];
  }

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = hash * 32 - hash + char;
    hash = hash % 0x100000000;
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Extracts machine_name from a field object, handling both snake_case and camelCase variants
 * @param field - Field object that may have machine_name or machineName property
 * @returns The machine_name value or null if not found
 */
export function getMachineName(field: any): string | null {
  return field?.machine_name || field?.machineName || null;
}
