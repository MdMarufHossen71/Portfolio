import { ACCENT_GRADIENT, accentWash } from '../../lib/accents'
import { gameAccent } from '../../data/games'
import type { Game } from '../../types/content'
import { TiltCard } from '../visuals/TiltCard'

interface GameCardProps {
  game: Game
  index: number
}

/**
 * One entry from the games catalogue.
 *
 * The tile is a generated gradient with the game's initials — no artwork files, so
 * 32 cards cost zero image requests and nothing has to be drawn per game.
 *
 * Deliberately absent:
 *   • No "Play" affordance. Nothing runs inside this portfolio, and a play button
 *     that navigates away would be a lie about what the card does.
 *   • No keyboard/touch control badges. Per-game control schemes could not be
 *     verified, and a wrong badge is worse than no badge.
 */
export function GameCard({ game, index }: GameCardProps) {
  const accent = gameAccent(game, index)
  const initials = game.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  return (
    <TiltCard as="li" className="flex flex-col p-4" max={7} lift={8}>
      <div
        aria-hidden="true"
        className="font-display grid h-20 place-items-center rounded-[var(--r-sm)] text-2xl font-bold tracking-tight text-[var(--c-on-accent)]"
        style={{ background: ACCENT_GRADIENT[accent], opacity: 0.9 }}
      >
        {initials}
      </div>

      <h3 className="font-display layer-1 mt-3 text-sm font-semibold tracking-tight">
        {game.name}
      </h3>

      <ul className="mt-2 flex flex-wrap gap-1">
        {game.genres.map((genre) => (
          <li
            key={genre}
            className="text-muted rounded-[var(--r-xs)] px-1.5 py-0.5 text-[0.625rem] font-medium"
            style={{ background: accentWash(accent) }}
          >
            {genre}
          </li>
        ))}
      </ul>
    </TiltCard>
  )
}
