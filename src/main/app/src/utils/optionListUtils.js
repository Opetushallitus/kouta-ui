// functions to manipulate option lists typically used by radio groups, checkbox groups, dropdowns, selects, multiselectors etc.

//return only options that are active (often: selected or checked)
export const getActiveOptions = (options) => options.filter(entry => entry.active);

export const findOptionByKey = (options, key) => options.find(entry => entry.key === key);

//return only first active option (relevant for single selection options)
export const getActiveOption = (options) => options.find(entry => entry.active);

//makes one option active or inactive in an option list that can have multiple active options
export const updateMultiSelectionOptionActivation = (options, change) => options.map(entry => ({
  ...entry,
  active: change.key === entry.key ? change.active : (entry.active === true)
}));

//makes one option active or inactive in an option list that can have only one active option
export const updateSingleSelectionOptionActivation = (options, change) => options.map(entry => ({
  ...entry,
  active: change.key === entry.key ? change.active : false
}));

//changes value inside one option
export const updateOptionValue = (options, change) => options.map(entry => ({
  ...entry,
  value: change.key === entry.key ? change.value : entry.value
}));

export const getActiveKey = (options) => (options.find(option => option.active) || {}).key;

export const getStatefulOptions = (options, selections) => options.map(option => ({
    ...option,
    active: selections[option.key]
}));
