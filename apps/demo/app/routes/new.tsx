import Editor from '@i4o/ohm'
import { useRef } from 'react'
import { LinksFunction } from '@remix-run/node'
import styles from '@i4o/ohm/main.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

const DUMMY_CONTENT = `
Lorem markdownum per ulciscitur, nec ei fecundaque statuam in mediis effugit
iuvenumque aetas. Oraque erat, epops flagrantem illo Veneris et flagrat et iussi
nutrix, stringitur viscera auferat spinae sumptaque
[maerens](#quoque-corpora-niger). Effundite longius montis properant funereum
eadem, temptat sic dixit fertque nigro, quos. Rubore et multa secuti, vidit
mortalibus huic movetur onerosus. Ante ad versat accepere tendentemque sorte ubi
Deianira, adfata alvum has bracchia loquax mihi!

- Invia sed sed profecturas
- Celare redeuntem auget talia certamina margine frendens
- At dixit oneratos Haec sunt cum nodus
- Posito inque meae non

Resupino columbae; pericula, hunc sororum virorum iuga duraeque albas et sed,
ostendisse. Coniugis mordebat [fertur concitus](#summo) erraverit quoque
ferrumque **pectus nullaque alta** maculosae ardua discrimine causamque visum
iamque. Reppulit ait quidem modo praeposuisse **Atlas**, in quinque denique
sanguis fratrum. Robore **quam**, nos ligno undique: sentit non cornu longo
gloria [suos](#sub-diverso-supplex). [Spe viam regni](#hoc-novo) senes iuventae
furorem locoque quantus nunc misit me offensa desiluit vero, corpus!

\`\`\`rust
let a = 1;
\`\`\`

Quae conplexibus egentes narrare *intellege ignes mox* Troiana. Quae lympha est
terrestribus desistere per fovesque coniunx transtra palmas accepta praestat
lupi, hanc prior? Ibi colus ipse hac liquores iam pavefacta aura;
[tibi](#quae-achillea) rigent, ait caecis intellegit Ulixes: lanient! Nec umor
Cassiope Phoebus sibi iam aspergine mensas ad incendia velox stetit mellaque
prior quaerit prosiliunt et metas viso Atalanta.

Fera cui fere Auguste, vestigia induruit; et leves diriguit, vel! In qui Cupido
venit, percepto omnis! Aeeta et fugit.

\`\`\`typescript
const b: number = 5;
\`\`\`

Bello sidereum tela, illo haut, infra parvo laeva ipsas. [Priamoque](#timido)
corpora; reos fixa esse quietis magnorum, ab et ligat sequitur reus ipse
adsumptis. Quo vidit! Sit ante vocis id oportuit Circe, risit, baculum traxit
hanc quoque sagitta solis timorem, ut. Cruoris siqua corpora huic arcus multa
exierit.`

export default function Index() {
	const content = useRef<string>(DUMMY_CONTENT)

	const changeHandler = (value: string) => {
		content.current = value
	}

	return (
		<div className='flex w-full justify-center'>
			<div className='flex w-full max-w-3xl flex-col gap-y-16 py-16'>
				<h1 className='text-xl text-white'>Welcome to Remix</h1>
				{/*
                // @ts-ignore */}
				<Editor defaultValue={DUMMY_CONTENT} onChange={changeHandler} />
			</div>
		</div>
	)
}
