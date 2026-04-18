import type { LucideProps } from "lucide-react-native"
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  Settings,
  Share2,
  Star,
  User,
  X,
} from "lucide-react-native"

export const iconMap = {
  alert: AlertCircle,
  arrow: ArrowRight,
  back: ChevronLeft,
  chevron: ChevronRight,
  clock: Clock,
  compass: Compass,
  heart: Heart,
  mail: Mail,
  mosque: MapPin,
  navigation: Navigation,
  phone: Phone,
  pin: MapPin,
  search: Search,
  settings: Settings,
  share: Share2,
  star: Star,
  user: User,
  x: X,
} as const

export type IconName = keyof typeof iconMap

export function Icon({
  name,
  size = 20,
  color = "currentColor",
  ...rest
}: LucideProps & { name: IconName }) {
  const Cmp = iconMap[name]
  return <Cmp size={size} color={color} {...rest} />
}
