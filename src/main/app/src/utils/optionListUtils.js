// functions to manipulate option lists typically used by radio groups, checkbox groups, dropdowns, selects, multiselectors etc.

//return only options that are active (often: selected or checked)
export const getActiveOptions = (options) => options.filter(entry => entry.active);

//makes one option active or inactive in an option list that can have multiple active options
export const updateMultiSelectionOptionActivation = (options, change) => options.map(entry => ({
  active: change.key === entry.key ? change.value : entry.active
}));

//makes one option active or inactive in an option list that can have only one active option
export const updateSingleSelectionOptionActivation = (options, change) => options.map(entry => ({
  ...entry,
  active: change.key === entry.key ? change.value : false
}));

//changes value inside one option
export const updateOptionValue = (options, change) => options.map(entry => ({
  ...entry,
  value: change.key === entry.key ? change.value : entry.value
}));
