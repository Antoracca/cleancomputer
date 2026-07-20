import Link from "next/link";
import { CATEGORIES } from "@/types/catalogue";
import { cn } from "@/lib/utils/cn";

/**
 * FILTRES DE CATÉGORIE
 *
 * Des liens, pas des boutons : chaque catégorie est une URL réelle, donc
 * indexable, partageable et rendue statiquement. Aucun JavaScript n'est requis
 * pour filtrer — ce qui compte sur un réseau lent.
 *
 * Défilement horizontal en mobile avec accroche, plutôt qu'un retour à la ligne
 * qui ferait sauter la mise en page.
 */
export function CategoryPills({ active }: { active?: string }) {
  return (
    <nav aria-label="Catégories" className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
        <li>
          <Pill href="/electronique" active={!active}>
            Tout
          </Pill>
        </li>
        {CATEGORIES.map((categorie) => (
          <li key={categorie.slug}>
            <Pill
              href={`/electronique/${categorie.slug}`}
              active={active === categorie.slug}
            >
              {categorie.nom}
            </Pill>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-pill border px-5 text-[0.9375rem] font-medium",
        "transition-colors duration-200",
        active
          ? "border-ink bg-ink text-frost"
          : "border-mist bg-white text-graphite hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
