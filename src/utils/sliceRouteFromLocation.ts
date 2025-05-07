type Coordinate = [number, number];

export const sliceRouteFromLocation = (
  route: Coordinate[],
  currentLocation: Coordinate,
  tolerance = 0.0001
): Coordinate[] => {
  if (!route || route.length === 0) return [];

  const isSameLocation = (a: Coordinate, b: Coordinate) => {
    return (
      Math.abs(a[0] - b[0]) < tolerance && Math.abs(a[1] - b[1]) < tolerance
    );
  };

  // Try to match exactly
  const exactMatchIndex = route.findIndex((point) =>
    isSameLocation(point, currentLocation)
  );

  if (exactMatchIndex !== -1) {
    return route.slice(exactMatchIndex + 1);
  }

  // Fallback to closest point
  const getDistance = (a: Coordinate, b: Coordinate) =>
    Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);

  const closestIndex = route.reduce((minIndex, point, index) => {
    return getDistance(point, currentLocation) <
      getDistance(route[minIndex], currentLocation)
      ? index
      : minIndex;
  }, 0);

  return route.slice(closestIndex + 1);
};
