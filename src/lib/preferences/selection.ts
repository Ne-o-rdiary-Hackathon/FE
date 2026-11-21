export const toggleActivity = <T>(selected: T[], id: T) =>
  selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];

export const toggleGroup = <T>(selected: T[], ids: T[]) => {
  const isAllSelected = ids.every((id) => selected.includes(id));
  return isAllSelected
    ? selected.filter((id) => !ids.includes(id))
    : [...selected, ...ids.filter((id) => !selected.includes(id))];
};
