export const removeDuplicatesByFeature = (items, getFeatureValue) => Object.values(items.reduce((itemMap, item) => ({
    ...itemMap,
    [getFeatureValue(item)]: item
}), {}));

export const replaceItemsWithMatchingProperty = (items, replacementItem, propertyName) =>
    items.map(oldItem => oldItem[propertyName] === replacementItem[propertyName] ? replacementItem : oldItem);

