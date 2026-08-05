export const PROPERTY_TYPE_GROUPS = ['', 'houses', 'flats'] as const;

export type PropertyTypeGroup = (typeof PROPERTY_TYPE_GROUPS)[number];

/**
 * Backend property types belonging to each group.
 * Sent to the API as a comma-separated `type` value.
 */
export const PROPERTY_TYPE_GROUP_MEMBERS: Record<
  Exclude<PropertyTypeGroup, ''>,
  string[]
> = {
  houses: ['Town House', 'Quad House', 'Bungalow', 'Villa'],
  flats: ['Apartment', 'Penthouse'],
};

export function getNextPropertyTypeGroup(
  group: PropertyTypeGroup
): PropertyTypeGroup {
  const index = PROPERTY_TYPE_GROUPS.indexOf(group);
  return PROPERTY_TYPE_GROUPS[(index + 1) % PROPERTY_TYPE_GROUPS.length];
}

/** Serialises a group into the `type` query value, e.g. `Apartment,Penthouse`. */
export function propertyTypeGroupToQuery(group: PropertyTypeGroup): string {
  if (!group) return '';
  return PROPERTY_TYPE_GROUP_MEMBERS[group].join(',');
}

/** Restores the group from a `type` query value (used when reading the URL). */
export function propertyTypeGroupFromQuery(value?: string): PropertyTypeGroup {
  if (!value) return '';

  const members = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!members.length) return '';

  const group = (Object.keys(PROPERTY_TYPE_GROUP_MEMBERS) as Exclude<
    PropertyTypeGroup,
    ''
  >[]).find((key) => {
    const groupMembers = PROPERTY_TYPE_GROUP_MEMBERS[key];
    return (
      members.length === groupMembers.length &&
      members.every((member) => groupMembers.includes(member))
    );
  });

  return group ?? '';
}
