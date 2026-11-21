export function reorderIconSlotsOnDrop(
  prev: Record<string, number>,
  draggedAppId: string,
  targetSlot: number,
  selectedAppIds: string[]
): Record<string, number> {
  const movingIds =
    selectedAppIds.length > 1 && selectedAppIds.includes(draggedAppId)
      ? [...selectedAppIds].sort((a, b) => (prev[a] ?? 0) - (prev[b] ?? 0))
      : [draggedAppId];

  if (movingIds.length > 1) {
    const next: Record<string, number> = { ...prev };
    const movingSet = new Set(movingIds);
    const remaining = Object.entries(prev)
      .filter(([id]) => !movingSet.has(id))
      .sort((a, b) => a[1] - b[1]);

    movingIds.forEach((id, offset) => {
      next[id] = targetSlot + offset;
    });

    const occupiedByMoving = new Set(movingIds.map((id) => next[id]));
    let cursor = 0;
    remaining.forEach(([id, oldSlot]) => {
      if (!occupiedByMoving.has(oldSlot)) {
        next[id] = oldSlot;
      } else {
        while (occupiedByMoving.has(cursor) || Object.values(next).includes(cursor)) cursor += 1;
        next[id] = cursor;
      }
    });
    return next;
  }

  const sourceSlot = prev[draggedAppId];
  if (sourceSlot === targetSlot) return prev;
  const occupantId = Object.keys(prev).find((id) => prev[id] === targetSlot);
  if (!occupantId) return { ...prev, [draggedAppId]: targetSlot };

  const slotMap = new Map<number, string>();
  for (const [id, s] of Object.entries(prev)) {
    if (id !== draggedAppId) slotMap.set(s, id);
  }
  const chain: string[] = [];
  let scan = targetSlot;
  while (slotMap.has(scan)) {
    chain.push(slotMap.get(scan)!);
    scan += 1;
  }
  const result: Record<string, number> = { ...prev, [draggedAppId]: targetSlot };
  chain.forEach((id, i) => {
    result[id] = targetSlot + i + 1;
  });
  return result;
}

