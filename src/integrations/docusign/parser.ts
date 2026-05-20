const TAB_ARRAYS = [
  "textTabs",
  "emailTabs",
  "numberTabs",
  "ssnTabs",
  "dateTabs",
  "zipTabs",
  "phoneNumberTabs",
  "listTabs",
];

export function tabsToRawObject(tabsJson: any): Record<string, string> {
  const raw: Record<string, string> = {};

  for (const key of TAB_ARRAYS) {
    const arr = tabsJson[key] || [];

    for (const t of arr) {
      const label = t.tabLabel || t.name;
      const value = (t.value ?? t.selected ?? t.originalValue ?? "").toString();

      if (!label) continue;
      if (value === "") continue;

      raw[label] = value;
    }
  }

  return raw;
}