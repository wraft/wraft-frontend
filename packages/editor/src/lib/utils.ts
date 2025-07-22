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

export function getUserColor(userId: string): string {
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

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = hash * 32 - hash + char;
    hash = hash % 0x100000000;
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
