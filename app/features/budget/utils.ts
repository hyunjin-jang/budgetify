export const extractRecommendations = (aiText: string, tab: string) => {
  const regex = /```json([\s\S]*?)```/g;
  const matches = [...aiText.matchAll(regex)];
  if (matches.length === 0) return [];
  try {
    const obj = JSON.parse(matches[0][1]);
    // [{ label, title, description, savings, saving_ratio, allocations }] 형태로 변환
    return Object.entries(obj).map(([label, value]: any) => ({
      label,
      title: value.title,
      description: value.description,
      savings: value.savings,
      saving_ratio: value.saving_ratio,
      allocations: value[tab]?.allocations ?? [],
    }));
  } catch {
    return [];
  }
}