export function LanguageSelect({
  label,
  language,
  onChange,
}: {
  label: string;
  language: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <>
      <label htmlFor="language-select" hidden>
        {label} <span role="presentation">:</span>
      </label>
      <select
        value={language}
        onChange={onChange}
        id="language-select"
        className="border border-slate-500 dark:border-yellow-50 rounded-sm text-md transition-[background] dark:transition-[background] duration-500 dark:duration-500 text-slate-800 dark:text-yellow-50 bg-yellow-50 dark:bg-slate-800"
      >
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="ko">🇰🇷 한국어</option>
      </select>
    </>
  );
}
