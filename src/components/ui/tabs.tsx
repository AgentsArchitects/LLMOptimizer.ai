"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ className, activeTab, setActiveTab, children }: any) => {
  return (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab })
        }
        return child
      })}
    </div>
  )
}

const TabsTrigger = ({ value, className, activeTab, setActiveTab, children }: any) => {
  const isActive = activeTab === value
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive ? "bg-background text-foreground shadow" : "hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, className, activeTab, children }: any) => {
  if (activeTab !== value) return null
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
