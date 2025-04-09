import type { IMessageOptions } from './types';

// import { holdbackMessage } from 'frontend/js-main/src/CookieHoldback/HoldbackMessage';

const holdbackMessage = (options: { action: string; consentTo: string }) => {
	const { action, consentTo } = options;
	const message = document.createElement('div');
	message.className = 'holdback-message';
	message.innerHTML = `For at kunne ${action} skal du give samtykke til <b>${consentTo}</b>`;
	return message;
};

export function messageForUser(messageOptions: IMessageOptions): void {
	const win = window as any;
	const { inline, playerElement, type } = messageOptions;

	playerElement.className = inline
		? 'flex flex-align--center text-align--center'
		: 'image-container-img image-container-img--viasat flex flex-align--center text-align--center';

	if (type === 'cmpHoldback') {
		if (win.ebJS.options.isEBJSReady) {
			const shownMessage = holdbackMessage({
				action: 'se dette <b>videoindhold</b>',
				consentTo: win.ebCMP.CONSENTNAMES.fullconsent
			}) as Node;
			playerElement.appendChild(shownMessage);
		} else {
			win.addEventListener('isEBReady', () => {
				const shownMessage = holdbackMessage({
					action: 'se dette <b>videoindhold</b>',
					consentTo: win.ebCMP.CONSENTNAMES.fullconsent
				}) as Node;
				playerElement.appendChild(shownMessage);
			});
		}
	} else if (type === 'geoHoldback') {
		const geoMessage = document.createElement('div');
		geoMessage.className = 'flex-item flex-item--center margin-auto';
		geoMessage.innerHTML = 'Dette indhold kan kun ses fra Danmark';
		playerElement.appendChild(geoMessage);
	}
}
