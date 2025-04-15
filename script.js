function parseMarkdownToCards(input) {
	const lines = input.split('\n');
	const cards = [];
	let currentCard = null;
	let listBuffer = [];

	const flushListBuffer = () => {
		if (listBuffer.length > 0) {
			currentCard.text += `<ul>\n${listBuffer.join('\n')}\n</ul>\n`;
			listBuffer = [];
		}
	};

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed === '') continue;

		if (trimmed.startsWith('#')) {
			// Vorherige Karte abschließen
			if (currentCard) {
				flushListBuffer();
				cards.push(currentCard);
				currentCard = null;
			}

			// Match mit erlaubtem Whitespace um die Nummer
			const match = trimmed.match(/^#\s*(\d+)\s+(.*)$/);
			if (match) {
				currentCard = {
					cardnumber: parseInt(match[1], 10),
					description: match[2],
					text: ''
				};
			} else {
				console.warn('Ungültiger Header übersprungen:', trimmed);
			}
		} else if (currentCard) {
			if (trimmed.startsWith('-')) {
				listBuffer.push(`<li>${trimmed.slice(1).trim()}</li>`);
			} else {
				flushListBuffer();
				currentCard.text += `<p>${trimmed}</p>\n`;
			}
		}
	}

	if (currentCard) {
		flushListBuffer();
		cards.push(currentCard);
	}

	return cards;
}

function formatCardNumber(num, cardNumberSums) {
	if (!cardNumberSums[Math.floor(num/50)*50 + '']) {
		cardNumberSums[Math.floor(num/50)*50 + ''] = 0
	}
	cardNumberSums[Math.floor(num/50)*50 + ''] ++

	return num.toString().padStart(3, '0')
}

function renderCards(cards) {
	const chunks = []
	// Immer für Karten 000-049, 050-099 und so weiter die Summe
	const cardNumberSums = {}
	for (let i = 0; i < cards.length; i += 6) {
		const group = cards.slice(i, i + 6);
		const pageContent = group.map(card => {
			return `
				<div class="card">
					<div class="card__number">${formatCardNumber(card.cardnumber, cardNumberSums)}</div>
					<div class="card__text">
						${card.text.trim()}
					</div>
				</div>
			`;
		}).join('\n');

		chunks.push(`<div class="pages__single">\n${pageContent}\n</div>`);
	}
	console.log("Die Anzahl der Karten in 50er-Schritten:")
	console.log(cardNumberSums)
	return chunks.join('\n\n')
}

let pages_html = ''
// Die richtigen Seiten
pages_html += renderCards(parseMarkdownToCards(karten_markdown))

// Eine Seite für die dicke Karte am Ende
pages_html += '<div class="pages__single">'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '<div class="card card--end"><div class="card__number">999</div><div class="card__text"><p>ABLAGE</p><p>Lege die verwendeten Karten hinter diese.</p><p>Vielleicht kommt irgendwann jemand, der sie wieder nach vorne holt.</p></div></div>'
pages_html += '</div>'

document.querySelector('.pages').innerHTML = pages_html
