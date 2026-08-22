import { useMemo, useState } from 'react'
import { GameCard } from '../components/cards/GameCard'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Button, ButtonExternal } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Section } from '../components/ui/Section'
import { githubMark } from '../data/brandMarks'
import { TOOLS_GAMES_LIVE_URL, TOOLS_GAMES_REPO_URL } from '../data/external'
import { GAME_COUNT, GAME_GENRE_COUNT, countByGenre, gameGenres, games } from '../data/games'
import { useSeo } from '../lib/seo'
import type { GameGenre } from '../types/content'

/**
 * Games showcase.
 *
 * Wording is chosen carefully and should stay that way: "listed", "catalogue",
 * "entries". In the source project each of these is a named, routed entry with the
 * per-game implementations still being built, so "32 playable games" would not be
 * true. There is also no Play button anywhere on this page — nothing runs here,
 * and a button that merely navigates away would misrepresent what it does.
 *
 * Genres are an editorial grouping applied in this portfolio for browsing. Control
 * schemes are not shown at all, because they could not be verified per game.
 */
export function Games() {
  useSeo({
    title: 'Games',
    description: `A catalogue of ${GAME_COUNT} small browser games across ${GAME_GENRE_COUNT} genres, part of the open-source Tools & Games project.`,
    path: '/games',
  })

  const [query, setQuery] = useState('')
  const [activeGenres, setActiveGenres] = useState<GameGenre[]>([])

  const visible = useMemo(() => {
    const normalised = query.trim().toLowerCase()
    return games.filter((game) => {
      const matchesQuery = !normalised || game.name.toLowerCase().includes(normalised)
      // Any selected genre matches, so picking two genres widens the list —
      // which is what a visitor browsing by taste expects.
      const matchesGenre =
        activeGenres.length === 0 || activeGenres.some((genre) => game.genres.includes(genre))
      return matchesQuery && matchesGenre
    })
  }, [activeGenres, query])

  const toggleGenre = (genre: GameGenre) => {
    setActiveGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre],
    )
  }

  const filtersActive = activeGenres.length > 0 || query.trim() !== ''

  return (
    <>
      <PageHeader
        eyebrow="Games"
        title="Small games, no install"
        intro={`The same open-source project also holds a games catalogue: ${GAME_COUNT} entries across ${GAME_GENRE_COUNT} genres, from arcade and puzzle to board and word games. They live on the project's own site — nothing on this page runs here.`}
        action={
          <>
            {TOOLS_GAMES_LIVE_URL ? (
              <ButtonExternal href={TOOLS_GAMES_LIVE_URL} variant="primary" context="Tools & Games">
                Open the project
              </ButtonExternal>
            ) : null}
            <ButtonExternal href={TOOLS_GAMES_REPO_URL} context="Tools & Games">
              <BrandIcon mark={githubMark} className="size-4" />
              Source code
            </ButtonExternal>
          </>
        }
      />

      <Section
        id="catalogue"
        eyebrow="Catalogue"
        title="Browse the list"
        intro="Genres are how I have grouped them here for browsing, not a label from the project itself. Individual games are still being built out behind these entries."
      >
        <div className="flex flex-col gap-5">
          <div className="max-w-md">
            <SearchInput
              value={query}
              onChange={setQuery}
              label="Search games by name"
              placeholder="Search games…"
              resultSummary={`${visible.length} of ${GAME_COUNT} games shown`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {gameGenres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                count={countByGenre(genre)}
                active={activeGenres.includes(genre)}
                onToggle={() => toggleGenre(genre)}
              />
            ))}
            {filtersActive ? (
              <Button
                variant="quiet"
                onClick={() => {
                  setActiveGenres([])
                  setQuery('')
                }}
              >
                Clear all
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {visible.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((game, index) => (
                <GameCard key={game.name} game={game} index={index} />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No games match that"
              description="Try a different name, or clear the genre filters."
              action={
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveGenres([])
                    setQuery('')
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </Section>
    </>
  )
}
