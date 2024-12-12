export function getRandomColor() {
  const colors = [
    "#F43F5E", // rose-500
    "#22D3EE", // cyan-400
    "#D1FAE5", // lime-300
    "#C084FC", // fuchsia-400
    "#10B981", // emerald-400
    "#6EE7B7", // teal-300
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-400
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
