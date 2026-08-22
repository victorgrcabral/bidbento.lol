import { TreemapRect } from "@/types";

interface TreemapItem<T> {
  data: T;
  value: number;
}

interface PositionedItem<T> {
  data: T;
  rect: TreemapRect;
}

/**
 * Squarified Treemap Algorithm
 * Calculates rectangular layout maintaining optimal aspect ratios (close to 1:1)
 * within a bounding box (x, y, w, h).
 */
export function computeSquarifiedTreemap<T>(
  items: TreemapItem<T>[],
  bounds: TreemapRect = { x: 0, y: 0, w: 100, h: 100 }
): PositionedItem<T>[] {
  if (!items || items.length === 0) return [];

  // Filter out non-positive values
  const validItems = items
    .filter((it) => it.value > 0)
    .sort((a, b) => b.value - a.value);

  if (validItems.length === 0) return [];

  const totalValue = validItems.reduce((acc, curr) => acc + curr.value, 0);
  const totalArea = bounds.w * bounds.h;

  if (totalArea <= 0 || totalValue <= 0) {
    return validItems.map((item) => ({
      data: item.data,
      rect: { x: bounds.x, y: bounds.y, w: 0, h: 0 },
    }));
  }

  // Normalized areas for each item
  const areas = validItems.map((it) => (it.value / totalValue) * totalArea);

  const results: PositionedItem<T>[] = [];

  function worstAspectRatio(row: number[], length: number): number {
    if (row.length === 0 || length <= 0) return Infinity;
    const rowSum = row.reduce((a, b) => a + b, 0);
    if (rowSum <= 0) return Infinity;
    const minVal = Math.min(...row);
    const maxVal = Math.max(...row);
    const lengthSq = length * length;
    const rowSumSq = rowSum * rowSum;

    return Math.max(
      (lengthSq * maxVal) / rowSumSq,
      rowSumSq / (lengthSq * minVal)
    );
  }

  function layoutRow(
    rowIndices: number[],
    currentBounds: TreemapRect
  ): TreemapRect {
    const rowSum = rowIndices.reduce((sum, idx) => sum + areas[idx], 0);
    const isHorizontal = currentBounds.w >= currentBounds.h;
    const side = isHorizontal ? currentBounds.h : currentBounds.w;
    const breadth = side > 0 ? rowSum / side : 0;

    let offset = isHorizontal ? currentBounds.y : currentBounds.x;

    for (const idx of rowIndices) {
      const area = areas[idx];
      const itemLength = breadth > 0 ? area / breadth : 0;

      if (isHorizontal) {
        results.push({
          data: validItems[idx].data,
          rect: {
            x: currentBounds.x,
            y: offset,
            w: breadth,
            h: itemLength,
          },
        });
        offset += itemLength;
      } else {
        results.push({
          data: validItems[idx].data,
          rect: {
            x: offset,
            y: currentBounds.y,
            w: itemLength,
            h: breadth,
          },
        });
        offset += itemLength;
      }
    }

    // Return remaining bounds
    if (isHorizontal) {
      return {
        x: currentBounds.x + breadth,
        y: currentBounds.y,
        w: Math.max(0, currentBounds.w - breadth),
        h: currentBounds.h,
      };
    } else {
      return {
        x: currentBounds.x,
        y: currentBounds.y + breadth,
        w: currentBounds.w,
        h: Math.max(0, currentBounds.h - breadth),
      };
    }
  }

  function squarify(
    childrenIndices: number[],
    currentRow: number[],
    currentBounds: TreemapRect
  ) {
    if (childrenIndices.length === 0) {
      if (currentRow.length > 0) {
        layoutRow(currentRow, currentBounds);
      }
      return;
    }

    const nextIndex = childrenIndices[0];
    const restIndices = childrenIndices.slice(1);
    const isHorizontal = currentBounds.w >= currentBounds.h;
    const side = isHorizontal ? currentBounds.h : currentBounds.w;

    if (currentRow.length === 0) {
      squarify(restIndices, [nextIndex], currentBounds);
      return;
    }

    const currentWorst = worstAspectRatio(
      currentRow.map((i) => areas[i]),
      side
    );
    const newRow = [...currentRow, nextIndex];
    const newWorst = worstAspectRatio(
      newRow.map((i) => areas[i]),
      side
    );

    if (newWorst <= currentWorst) {
      squarify(restIndices, newRow, currentBounds);
    } else {
      const remainingBounds = layoutRow(currentRow, currentBounds);
      squarify(childrenIndices, [], remainingBounds);
    }
  }

  squarify(
    validItems.map((_, i) => i),
    [],
    bounds
  );

  return results;
}
