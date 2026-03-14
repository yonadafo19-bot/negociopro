import { useState } from 'react'

const Toggle = ({ checked = false, onChange, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = () => {
    if (disabled) return

    const newValue = !isChecked
    setIsChecked(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <button
      type="button"
      onClick={handleChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isChecked
          ? 'bg-primary-500 dark:bg-primary-600'
          : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={isChecked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default Toggle
