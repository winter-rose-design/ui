/** @param {HTMLFormElement} form_element */
export default function form(form_element) {
	form_element.setAttribute('novalidate', true);

	/** @param {SubmitEvent} e */
	async function handle_submit(e) {
		e.preventDefault();

		const is_valid = validate();

		if (!is_valid) return;

		e.target.dispatchEvent(new CustomEvent('form-submission-start', { bubbles: true }));

		e.submitter?.classList.add('--loading');

		const response = await fetch(e.target.getAttribute('action'), {
			method: e.target.getAttribute('method'),
			body: new FormData(e.target)
		});

		const json = await response.json();

		e.submitter?.classList.remove('--loading');

		e.target.dispatchEvent(new CustomEvent('form-submission-end', { bubbles: true }));

		e.target.dispatchEvent(new CustomEvent('form-response', { bubbles: true, detail: { json } }));
	}

	form_element.addEventListener('submit', handle_submit);
}

function validate() {}
