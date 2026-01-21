# Ejemplo de componente TypeScript

## Componentes con TypeScript

```typescript
import { FC } from 'react'

interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const Button: FC<ButtonProps> = ({ text, onClick, variant = 'primary', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-primary' : 'bg-secondary'}`}
    >
      {text}
    </button>
  )
}

export default Button
```

Coloca aquí tus componentes exportados de Figma con tipos TypeScript.
