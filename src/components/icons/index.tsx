import {
  ArrowUpDown,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  type LucideIcon,
} from "lucide-react"
import { CaretSortIcon, CheckIcon, Cross2Icon, MixerHorizontalIcon, PinBottomIcon } from "@radix-ui/react-icons"

export type Icon = LucideIcon

export const Icons = {
  arrowUpDown: CaretSortIcon,
  check: CheckIcon,
  chevronDown: ChevronDown,
  chevronFirst: ChevronFirst,
  chevronLast: ChevronLast,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  cross: Cross2Icon,
  view: MixerHorizontalIcon,
  pinBottom: PinBottomIcon,
  plusCircle: PlusCircle,
} as const 