import { LitElement, html, css } from 'lit';

class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      color: var(--my-element-text-color, blue);
    }
  `;

  render() {
    return html`<p>Hello, WebExtension with LitElement!</p>`;
  }
}

customElements.define('my-element', MyElement);
