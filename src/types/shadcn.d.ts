// src/types/shadcn.d.ts
declare module "@/components/ui/alert" {
    export const Alert: React.FC<React.HTMLAttributes<HTMLDivElement> & {
      variant?: "default" | "destructive"
    }>
    export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>
  }
  
  declare module "@/components/ui/card" {
    export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>
    export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
    export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>
    export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>
  }
  
  declare module "@/components/ui/avatar" {
    export const Avatar: React.FC<React.HTMLAttributes<HTMLDivElement>>
    export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>>
  }