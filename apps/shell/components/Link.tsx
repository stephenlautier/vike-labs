import type { ReactElement } from "react";
import { usePageContext } from "vike-react/usePageContext";

export function Link({ href, children }: { href: string; children: string }): ReactElement {
	const pageContext = usePageContext();
	const { urlPathname } = pageContext;
	const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
	return (
		<a href={href} className={isActive ? "is-active" : undefined}>
			{children}
		</a>
	);
}
