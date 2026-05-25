import {
  BookMarked,
  Bookmark,
  Bot,
  Camera,
  Check,
  Clapperboard,
  Compass,
  Film,
  Heart,
  History,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  User,
} from 'lucide-react'

const ICONS = {
  search: Search,
  settings: Settings,
  menu: Menu,
  user: User,
  logout: LogOut,
  watchlist: Bookmark,
  history: History,
  favorites: Heart,
  collections: BookMarked,
  trending: Film,
  browse: Compass,
  add: Plus,
  remove: Trash2,
  watched: Check,
  star: Star,
  ai: Bot,
  camera: Camera,
  sparkles: Sparkles,
  cinema: Clapperboard,
}

const SIZE_MAP = { 16: 16, 20: 20, 24: 24 }
const TONE_MAP = {
  normal: 'var(--foreground)',
  muted: 'var(--kino-text-muted)',
  gold: '#D4A574',
}

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.9,
  tone = 'muted',
  className = '',
}) {
  const Comp = ICONS[name]
  if (!Comp) return null

  return (
    <Comp
      size={SIZE_MAP[size] || 20}
      strokeWidth={strokeWidth}
      color={TONE_MAP[tone] || TONE_MAP.muted}
      className={className}
      aria-hidden="true"
    />
  )
}
