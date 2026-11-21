export const toggleActivity = (selected: string[], id: string) =>
  selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];

export const toggleGroup = (selected: string[], ids: string[]) => {
  const isAllSelected = ids.every((id) => selected.includes(id));
  return isAllSelected
    ? selected.filter((id) => !ids.includes(id))
    : [...selected, ...ids.filter((id) => !selected.includes(id))];
};
