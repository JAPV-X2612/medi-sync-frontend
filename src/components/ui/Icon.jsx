const Icon = ({ name, className = "", fill = 0, size = 24 }) => (
  <span
    className={`material-symbols-outlined select-none ${className}`}
    style={{
      fontSize: size,
      fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    }}
  >
    {name}
  </span>
);

export default Icon;
