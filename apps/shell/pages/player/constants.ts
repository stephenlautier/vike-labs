/**
 * Shared SSR placeholder props for the `RiftPlayerApp` Stencil component.
 *
 * The compile-time `@stencil/ssr` plugin requires literal/static prop values
 * so it can pre-render Declarative Shadow-DOM at build time. Real user data
 * is injected client-side after hydration via `PlayerHydrator`. These
 * constants are hoisted to module scope so JSX prop references stay
 * referentially stable across renders.
 */
export const GUEST_USER = {
	id: "guest",
	summonerName: "Summoner",
	profileIconId: 0,
	summonerLevel: 30,
} as const;

export const CROSS_MFE_LINK_STYLE = {
	marginTop: "1rem",
	fontSize: "0.75rem",
	color: "rgb(161 161 170)",
} as const;
