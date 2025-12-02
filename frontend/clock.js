class LiveClock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.clockElement = document.createElement("span");
        this.shadowRoot.appendChild(this.clockElement);

        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        this.clockElement.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}

customElements.define("live-clock", LiveClock);