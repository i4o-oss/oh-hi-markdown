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
# Et magno velut actusque hunc vernum solumque

## Arcus dolores fidem

Lorem markdownum tumulumque munere et ubi Hectoris fata pictis astris pomaque,
iuvenali aliquis curarum, o. Nota nec concita dubitare angustum et in tristia
index superi gregesque conpressit eo nurus. Taurorum onerosa *Notum tabo* videor
tamen siquis fata mihi Haemonio mercede, vox?

## Avsis mihi natura

Digitis ignis speret vocatum errant veniente plena sui Ceae qui ante. Ityosque
civilia tecta. Fluvios coniugis ex, est Thermodontiaca candida.

1. Et clara in
2. Nec virgineosque terras pelagi se futura Stheneleius
3. Licet temporis utraque
4. Inrupit illic
5. Sed agebat vim sub ibitis dare revolvor

## Non extendi mea

Invitam Telamone viderem adiutrixque aevi additur est motu annua stetit cernis
carinas. **Quem** sentit ergo resoluta nunc constantia ante trahebat disceditis
memorant furit supplex, sentit non!

- Super interdixit ieiunia tutus claudit Ophionides aut
- Per excipit
- Spectabat erat
- Nomina confiteor tristique Ampyciden nitidis hominem tantos
- Tempore simul subiere

## Erat erat nescio herba Pelopeia depositum restet

Cur e *dea Ausoniae*, a, meis ipse, et medullas volucres? Dum fugae Tyrrhenus
inpia, ipso cum procul, iubeatve illam? **Et auctor**; pennis, *signa*, defuit
novi hominem fugit, at gerens victricia resupinus vultum, ait dicenda. Occidat
ita mihi repetisse, cervice virque edidit te nato factis vetat beatam illo color
quod adimit nostra indestrictus herbis. Pallidiora catulo.

## Remittit patrium faciem armandique surgis ortus torum

Fortibus Haemonio adorat meosque, non corpus lumina: Phoce visa. Est fecit damno
natarum quoque fulmina religione occupat foliis litus herbis dentibus.

1. Fuit in vacuum canamus operitur
2. Require utinam Meleagron studio
3. Ebur fore successor illo captivo erant per

Nullisque *attonitas* sanet. Invenerit ruit lenius, Latona cernis penetravit me
quasi Iove [totidem](#quis-quia). Enipeu caesariem Hiberis hic sub, tunc nos
vacuae, leni iustamque flamine.
`

export default function Index() {
	const content = useRef<string>(DUMMY_CONTENT)

	const changeHandler = (value: () => string) => {
		content.current = value()
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
