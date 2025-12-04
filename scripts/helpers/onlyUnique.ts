export default function onlyUnique<T>(array: T[]) : T[]{
	return array.filter(onlyUniqueFilter)
}

function onlyUniqueFilter(value : unknown, index : number, array: unknown[]) {
  return array.indexOf(value) === index;
}