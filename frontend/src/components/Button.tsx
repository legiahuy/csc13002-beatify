import { forwardRef } from "react"
import { twMerge } from "tailwind-merge";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  disable,
  type = "button",
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={twMerge(`
        w-full
        rounded-full
        bg-cyan-500
        border
        border-transparent
        px-3
        py-3
        disable:cursor-not-allowed
        disable:opacity-50
        text-black
        font-bold
        hover:opacity-80
        transition
      `, 
        className
      )}
      disabled={disable}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button;