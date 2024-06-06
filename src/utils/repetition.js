export const groupRepeatedUnits = (templateArray = [1]) => {
  let templateUnitArray  = templateArray.map(e => e + 'fr')
  const groups = [[templateUnitArray.shift()]];
  for (const templateUnit of templateUnitArray) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.indexOf(templateUnit) !== -1) {
      lastGroup.push(templateUnit);
    } else {
      groups.push([templateUnit]);
    }
  }
  return groups;
};

export const createRepetition = (groups, maxRepetition = 1) => {
  return groups
    .map(group =>
      // If you want to add repetition only when a measure is repeated more than x times,
      // change maxRepetition value to x
      group.length === maxRepetition
        ? group.join(" ")
        : `repeat(${group.length}, ${group[0]})`
    )
    .join(" ");
};
