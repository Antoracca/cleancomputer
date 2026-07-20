import { cn } from "@/lib/utils/cn";

/**
 * DRAPEAUX
 *
 * Tracés SVG en ligne plutôt qu'une librairie d'icônes ou des emojis.
 *
 * Trois raisons :
 * — les emojis sont proscrits sur ce projet, et leur rendu varie d'un système
 *   à l'autre au point que certains drapeaux n'apparaissent pas du tout sous
 *   Windows ;
 * — une librairie de drapeaux pèse plusieurs centaines de kilo-octets pour
 *   couvrir 250 pays, alors que neuf suffisent ici ;
 * — en SVG, le rendu est identique partout et pèse quelques centaines d'octets.
 *
 * Les proportions sont normalisées en 3:2 pour que tous s'alignent, même si
 * certains drapeaux ont officiellement un autre ratio.
 */

const ETOILE =
  "M0,-1 L0.2245,-0.309 L0.951,-0.309 L0.363,0.118 L0.588,0.809 L0,0.382 L-0.588,0.809 L-0.363,0.118 L-0.951,-0.309 L-0.2245,-0.309 Z";

function Etoile({
  x,
  y,
  taille,
  couleur,
}: {
  x: number;
  y: number;
  taille: number;
  couleur: string;
}) {
  return (
    <path
      d={ETOILE}
      fill={couleur}
      transform={`translate(${x} ${y}) scale(${taille})`}
    />
  );
}

/** Bandes verticales de largeur égale. */
function Verticales({ couleurs }: { couleurs: string[] }) {
  const l = 30 / couleurs.length;
  return (
    <>
      {couleurs.map((c, i) => (
        <rect key={i} x={i * l} y={0} width={l} height={20} fill={c} />
      ))}
    </>
  );
}

const TRACES: Record<string, React.ReactNode> = {
  FR: <Verticales couleurs={["#002395", "#FFFFFF", "#ED2939"]} />,
  BE: <Verticales couleurs={["#000000", "#FAE042", "#ED2939"]} />,
  CI: <Verticales couleurs={["#F77F00", "#FFFFFF", "#009E60"]} />,

  CM: (
    <>
      <Verticales couleurs={["#007A5E", "#CE1126", "#FCD116"]} />
      <Etoile x={15} y={10} taille={3.2} couleur="#FCD116" />
    </>
  ),

  SN: (
    <>
      <Verticales couleurs={["#00853F", "#FDEF42", "#E31B23"]} />
      <Etoile x={15} y={10} taille={3.2} couleur="#00853F" />
    </>
  ),

  MA: (
    <>
      <rect width={30} height={20} fill="#C1272D" />
      {/* Pentagramme évidé : cinq branches tracées, centre laissé au rouge */}
      <path
        d={ETOILE}
        transform="translate(15 10) scale(4.6)"
        fill="none"
        stroke="#006233"
        strokeWidth={0.14}
      />
    </>
  ),

  CF: (
    <>
      <rect width={30} height={5} y={0} fill="#003082" />
      <rect width={30} height={5} y={5} fill="#FFFFFF" />
      <rect width={30} height={5} y={10} fill="#289728" />
      <rect width={30} height={5} y={15} fill="#FFCE00" />
      {/* Bande verticale rouge, au centre */}
      <rect x={13} y={0} width={4} height={20} fill="#D21034" />
      <Etoile x={4} y={3.4} taille={2.6} couleur="#FFCE00" />
    </>
  ),

  US: (
    <>
      <rect width={30} height={20} fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect
          key={i}
          y={(i * 20) / 13}
          width={30}
          height={20 / 13}
          fill="#B22234"
        />
      ))}
      <rect width={12} height={(20 / 13) * 7} fill="#3C3B6E" />
      <Etoile x={3} y={2.4} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={6.5} y={2.4} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={9.5} y={2.4} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={4.8} y={5.4} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={8} y={5.4} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={3} y={8.2} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={6.5} y={8.2} taille={1.1} couleur="#FFFFFF" />
      <Etoile x={9.5} y={8.2} taille={1.1} couleur="#FFFFFF" />
    </>
  ),

  CN: (
    <>
      <rect width={30} height={20} fill="#EE1C25" />
      <Etoile x={5} y={5} taille={3} couleur="#FFFF00" />
      <Etoile x={10} y={2} taille={1} couleur="#FFFF00" />
      <Etoile x={12} y={4.4} taille={1} couleur="#FFFF00" />
      <Etoile x={12} y={7.4} taille={1} couleur="#FFFF00" />
      <Etoile x={10} y={9.6} taille={1} couleur="#FFFF00" />
    </>
  ),
};

export function Drapeau({
  code,
  nom,
  className,
}: {
  code: string;
  nom: string;
  className?: string;
}) {
  const trace = TRACES[code];

  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-ink/10",
        className,
      )}
      role="img"
      aria-label={`Drapeau ${nom}`}
    >
      {trace ? (
        <svg viewBox="0 0 30 20" className="block size-full">
          {trace}
        </svg>
      ) : (
        // Repli pour un pays non tracé : le code ISO sur fond neutre. Jamais
        // de carré vide, qui se lirait comme une image cassée.
        <svg viewBox="0 0 30 20" className="block size-full">
          <rect width={30} height={20} fill="#E4E9F2" />
          <text
            x={15}
            y={13.5}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fill="#697586"
            fontFamily="var(--font-sans)"
          >
            {code}
          </text>
        </svg>
      )}
    </span>
  );
}
