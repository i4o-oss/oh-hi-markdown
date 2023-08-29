import type { V2_MetaFunction } from '@remix-run/node'
import Editor from '@i4o/ohm'
import { useRef } from 'react'

export const meta: V2_MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

const DUMMY_CONTENT = `
# Siquem vagus poenam adieci graia pennis

## Tantum quaeque poteras carmina in motaque undique

Lorem markdownum utrumque Pyracmon olivae; amat crimen sperneret erat, tenet.
Ipse membris, corporis, et auraeque quae momentaque cernit *intercipit Marte
Sybarin* si auditum. Positoque saepe cum, vos magnum femina nefas odiumque
conantur praeferri minimus ventis summis venturi, qua opibus. Euryte sex eodem
solent, armo aurum avus tempora demens: cannis est: et et huius eo raucis.

Lapidis quod **ab senes adsis**; tam vite iubet undis cruor, nulla, rebus,
signisque. Fallere in elapsae pugnax pro ambas levat est lignoque vanis
lacertis. Et plura multum confessaque caelo temeraria incoquit iamque
pollentibus corpus emittitque solita. Secreta nemorosi, est et enixa, satia.

Pectora nebulas navita; ut trahunt amplexu, vires; te contra guttae! Laevaque te
genus mutua hunc *metus vidit* exclamat matrem; Titania veni est eratque se.
Harena dentibus moratus placuit furtim me, est caput pectora, Miletida quod
contendere linguae. Pylio Halcyoneus iniquae dixit. Reserata eduxit moenibus
quinque debuerant silvae blanditias habuere aegra, ut movit parte gentibus deae
artus nervis si ferrum.

## Tunc hostem

Creatam Minyeias summos, da pecori promptu auras nec parum successu convicia
virginitate ut equorum signorum mitia; formosae. Eunti his crudelis postibus
loquendo Bromiumque violas ad mollito ait dextera gratia rapiunt precibus
novissima, negabit fateri iustissima! Nuncupat fata, cum vulnere hydros canentis
paternam ea at, haberent.

Equi Achivi utinam tractu nec sublime sublime. Traxere manu relictum, quot
[pudibundaque](#menephron-caesareo-tamen) solidis huius metuaris et mihi.

Consorte nobis mihi femina certamina at capitum *vestri*, nostri annos
adsumptumque mea patulo quaque utroque. Cum **revulsit pignora**. Parentis pro,
iste nec, sed adflabitur procul et **corpore longus**. Aura inerant: et vale
mixta Sidone.

Viro Aetnae, oculos, committitur tamen caeruleas nobis, et. Ac est pererrant et
**victus**, tenuisse sic debita adversa et Andron solidum tura viae. Ipsumque
**rapidus**. Casus *quam* nuncupat invenerit albet, fidem aures femina populi
ignotosque fulmina. Ventorum cinguntur lapsum.
`

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
				<Editor
					placeholder='Start Writing...'
					value={content.current}
					onChange={changeHandler}
				/>
			</div>
		</div>
	)
}
