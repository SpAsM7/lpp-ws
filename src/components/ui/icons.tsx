import {
  Sun,
  Moon,
  Loader2,
  Mail,
  Key,
  Check,
  Upload,
  AlertTriangle,
  Pencil,
  Trash2,
  User,
  Users,
  Building,
  Building2,
  Scroll,
  Landmark,
  Heart,
  Star,
  Briefcase,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  sun: Sun,
  moon: Moon,
  spinner: Loader2,
  mail: Mail,
  key: Key,
  check: Check,
  upload: Upload,
  warning: AlertTriangle,
  edit: Pencil,
  trash: Trash2,
  user: User,
  users: Users,
  building: Building,
  building2: Building2,
  scroll: Scroll,
  landmark: Landmark,
  heart: Heart,
  star: Star,
  briefcase: Briefcase,
  piggyBank: (props: React.ComponentProps<"svg">) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/>
      <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
      <path d="M16 11c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1z"/>
    </svg>
  ),
  handshake: (props: React.ComponentProps<"svg">) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
      <path d="M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3l3.13 3.13 3.13-3.13c.83-.83.83-2.17 0-3L12 5.36z"/>
    </svg>
  ),
  google: (props: React.ComponentProps<"svg">) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  ),
}
