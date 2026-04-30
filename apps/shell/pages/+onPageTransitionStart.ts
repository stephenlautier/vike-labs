// https://vike.dev/onPageTransitionStart

export async function onPageTransitionStart(): Promise<void> {
	document.body.classList.add("page-transition");
}
