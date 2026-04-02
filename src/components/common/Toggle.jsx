import clsx from 'clsx'

const Toggle = ({ checked = false, onChange, disabled = false, className = '' }) => {
  const handleChange = () => {
    if (disabled) return
    if (onChange) {
      onChange(!checked)
    }
  }

  return (
    <button
      type="button"
      onClick={handleChange}
      disabled={disabled}
      className={clsx(
        'toggle-neo',
        checked && 'toggle-neo-active',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role="switch"
      aria-checked={checked}
    >
      <span className={clsx('toggle-neo-thumb', checked && 'bg-white')} />
    </button>
  )
}

export default Toggle
