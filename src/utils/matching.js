export const getSharedSkills = (skillsA = [], skillsB = []) => {
  const setA = new Set(skillsA.map((s) => s.toLowerCase().trim()));
  const setB = new Set(skillsB.map((s) => s.toLowerCase().trim()));
  return [...setA].filter((skill) => setB.has(skill));
};