// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";

/**
 * Inline script that resolves the saved theme (cookie or localStorage) and
 * applies the `dark` class on `<html>` BEFORE React hydrates, eliminating
 * the flash of light content on initial paint when the user has chosen
 * dark or system-dark.
 */
const NO_FLASH_THEME_SCRIPT = `(() => {
	try {
		var ck = document.cookie.split('; ').find(function(c){return c.indexOf('rift-theme=')===0;});
		var stored = ck ? decodeURIComponent(ck.split('=')[1]) : (localStorage.getItem('rift-theme') || 'system');
		var resolved = stored === 'system'
			? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: stored;
		if (resolved === 'dark') document.documentElement.classList.add('dark');
		document.documentElement.style.colorScheme = resolved;
	} catch (e) {}
})();`;

export function Head() {
	return (
		<>
			<link rel="icon" href={logoUrl} />
			{/* oxlint-disable-next-line react/no-danger -- inline no-flash theme script must run synchronously before hydration */}
			<script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
		</>
	);
}
