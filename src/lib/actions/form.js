/** @param {HTMLElement} form_element */
export default function form(form_element) {
	form_element.setAttribute('novalidate', true);

	/** @param {SubmitEvent} event */
	async function handle_submit(event) {
		event.preventDefault();

		const is_valid = true;

		if (!is_valid) return;

		event.target.dispatchEvent(new CustomEvent('form-submission-start', { bubbles: true }));

		const response = await fetch(event.target.getAttribute('action'), {
			method: event.target.getAttribute('method'),
			body: new FormData(event.target)
		});

		event.target.dispatchEvent(new CustomEvent('form-submission-end', { bubbles: true }));

		const json = await response.json();

		event.target.dispatchEvent(
			new CustomEvent('form-response', { bubbles: true, detail: { json } })
		);
	}

	form_element.addEventListener('submit', handle_submit);
}
