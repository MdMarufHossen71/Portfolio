import type { AccentKey, Game, GameGenre } from '../types/content'

/**
 * Games showcase for the external Tools & Games project.
 *
 * ─── THREE THINGS TO KNOW BEFORE EDITING ─────────────────────────────────────
 *
 * 1. THE COUNT IS 32, AND IT IS DERIVED.
 *    The brief this catalogue came from labelled the list "33 games", but it
 *    contains 32 names. Checked against the source project on 2026-08-22: its own
 *    data file also holds exactly 32 entries, and "33" appears nowhere in it. So
 *    "33" was simply an off-by-one, and it must never be published. Every figure
 *    the site shows comes from `games.length` — add or remove an entry and the UI
 *    follows automatically; no string anywhere needs updating.
 *
 * 2. THESE ARE CATALOGUE ENTRIES, NOT FINISHED GAMES.
 *    In the source project each entry is a named, routed slot; the per-game
 *    implementations are still being built. Copy on the Games page therefore says
 *    "listed" / "catalogue", never "32 playable games". Do not upgrade that
 *    wording without checking the source project again.
 *
 * 3. GENRES ARE EDITORIAL, CONTROLS ARE NOT CLAIMED.
 *    The `genres` below are a grouping applied here for filtering and browsing —
 *    not a field copied out of the source project. Per-game control schemes
 *    (keyboard vs touch) are deliberately NOT listed: they could not be verified
 *    per game, and a wrong badge is worse than no badge.
 *
 * Nothing here runs in the portfolio. Every card links out to the source project.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const games: Game[] = [
  { name: 'Snake', genres: ['Arcade', 'Action'], featured: true, accent: 'cyan' },
  { name: 'Tetris', genres: ['Puzzle', 'Arcade'], featured: true, accent: 'violet' },
  { name: '2048', genres: ['Puzzle', 'Logic'], featured: true, accent: 'blue' },
  { name: 'Sky Hopper', genres: ['Arcade', 'Runner'] },
  { name: 'Brick Breaker', genres: ['Arcade', 'Action'] },
  { name: 'Space Defenders', genres: ['Shooter', 'Arcade'] },
  { name: 'Dino Dash', genres: ['Runner', 'Arcade'] },
  { name: 'Fruit Merge', genres: ['Puzzle', 'Physics'] },
  { name: 'Asteroids', genres: ['Shooter', 'Arcade'] },
  { name: 'Maze Chaser', genres: ['Maze', 'Arcade'] },
  { name: 'Minesweeper', genres: ['Logic', 'Puzzle'], featured: true, accent: 'cyan' },
  { name: 'Sudoku', genres: ['Logic', 'Puzzle'], featured: true, accent: 'violet' },
  { name: '15 Puzzle', genres: ['Puzzle', 'Logic'] },
  { name: 'Memory Match', genres: ['Memory', 'Puzzle'], featured: true, accent: 'blue' },
  { name: 'Tic Tac Toe', genres: ['Board', 'Strategy'], featured: true, accent: 'cyan' },
  { name: 'Connect Four', genres: ['Board', 'Strategy'] },
  { name: 'Checkers', genres: ['Board', 'Strategy'] },
  { name: 'Hangman', genres: ['Word', 'Puzzle'] },
  { name: 'Word Grid', genres: ['Word', 'Puzzle'] },
  { name: 'Word Search', genres: ['Word', 'Memory'] },
  { name: 'Anagram Sprint', genres: ['Word', 'Typing'] },
  { name: 'Geo Quiz', genres: ['Quiz', 'Memory'] },
  { name: 'Math Sprint', genres: ['Quiz', 'Logic'] },
  { name: 'Water Sort', genres: ['Puzzle', 'Logic'] },
  { name: 'Block Fit', genres: ['Puzzle', 'Strategy'] },
  { name: 'Tower Guard', genres: ['Strategy', 'Action'] },
  { name: 'Idle Workshop', genres: ['Strategy'] },
  { name: 'Hill Rider', genres: ['Physics', 'Runner'] },
  { name: 'Maze Runner', genres: ['Maze', 'Runner'] },
  { name: 'Territory Loop', genres: ['Arcade', 'Strategy'] },
  { name: 'Pocket Pool', genres: ['Physics', 'Action'] },
  { name: 'Type Blaster', genres: ['Typing', 'Action'], featured: true, accent: 'violet' },
]

/** Genre filter order. Every genre listed here is used by at least one game. */
export const gameGenres: GameGenre[] = [
  'Arcade',
  'Puzzle',
  'Shooter',
  'Runner',
  'Logic',
  'Memory',
  'Board',
  'Word',
  'Quiz',
  'Strategy',
  'Physics',
  'Maze',
  'Action',
  'Typing',
]

/** Derived counts — the only numbers the UI is allowed to display. */
export const GAME_COUNT = games.length
export const GAME_GENRE_COUNT = gameGenres.length

export const featuredGames = games.filter((g) => g.featured)

/** How many games sit in a genre, for the filter chips. */
export function countByGenre(genre: GameGenre): number {
  return games.filter((g) => g.genres.includes(genre)).length
}

/**
 * Stable accent for cards without an explicit one, so colour is varied but does
 * not reshuffle between renders.
 */
const ACCENT_CYCLE: AccentKey[] = ['cyan', 'violet', 'blue']

export function gameAccent(game: Game, index: number): AccentKey {
  return game.accent ?? ACCENT_CYCLE[index % ACCENT_CYCLE.length]
}
