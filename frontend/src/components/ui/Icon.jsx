function Icon({ name, size = 20, style = {} }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

export default Icon
