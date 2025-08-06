import React from "react"
import classNames from "classnames"

export function Button({ asChild, className, variant = "default", size = "md", ...props }) {
  const Tag = asChild ? "a" : "button"
  return (
    <Tag
      className={classNames(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none",
        {
          "px-4 py-2 text-sm": size === "md",
          "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
          "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100": variant === "outline",
          "text-gray-700": variant === "ghost",
          "bg-white text-black": variant === "secondary"
        },
        className
      )}
      {...props}
    />
  )
}
