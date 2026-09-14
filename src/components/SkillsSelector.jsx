import { useState, useMemo } from "react";
import { SKILLS_LIST } from "../utils/skillsList";

const MAX_SKILLS = 15;

const SkillsSelector = ({ value = [], onChange }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return SKILLS_LIST.filter(
      (skill) => skill.toLowerCase().includes(lowerQuery) && !value.includes(skill)
    ).slice(0, 8);
  }, [query, value]);

  const addSkill = (skill) => {
    if (value.length >= MAX_SKILLS) return;
    onChange([...value, skill]);
    setQuery("");
    setIsOpen(false);
  };

  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill) => (
          <span key={skill} className="badge badge-primary gap-1">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:text-error"
              aria-label={`Remove ${skill}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={value.length >= MAX_SKILLS ? `Max ${MAX_SKILLS} skills reached` : "Search and add a skill..."}
          disabled={value.length >= MAX_SKILLS}
          className="input input-bordered w-full"
        />

        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((skill) => (
              <li key={skill}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-4 py-2 hover:bg-base-200 text-sm"
                >
                  {skill}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-base-content/50 mt-1">{value.length}/{MAX_SKILLS} skills added</p>
    </div>
  );
};

export default SkillsSelector;