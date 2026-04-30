export async function onPageTransitionEnd(): Promise<void> {
	document.body.classList.remove("page-transition");
}
