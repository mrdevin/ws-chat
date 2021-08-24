import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement("ws-chat")
export class WsChat extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            height: 500px;
            width: 400px;
        }

        header,
        [part=chat],
        footer {
            display: flex;
            margin:0;
            padding: 0;
        }

        header,
        footer{
            background-color: darkgrey;
            min-height: 40px;
            padding: 5px;
            /* box-sizing: border-box; */
        }

        header{
            align-items: center;
            justify-content: center;
            padding: 5px;
        }
        [part="close"] {
            justify-self: flex-end;
            margin-left: auto;
        }

        [part=chat] {
            flex-wrap: nowrap;
            flex-direction: column;
            background-color: white;
            flex: 1;
            justify-content: flex-end;
            padding: 0px 5px;

        }

        [part="msg"],
        [part="msg other"] {
            display: block;
            background-color: sienna;
            color: white;
            border-radius: 10px;
            box-sizing: border-box;
            max-width: 75%;
            padding: 5px;
            margin: 10px 0;
            align-self: flex-end;
        }
        [part="msg other"] {
            display: block;
            background-color: white;
            border-color: sienna;
            color: sienna;
            align-self: flex-start;

        }

        input {
            display: flex;
            flex: 1;
            width: auto;
            margin-right: 1%;
        }
    `;

    @property({ type: String })
    chats: string;

    @property({ type: String })
    url = 'ws://127.0.0.1:1337';

    @property({ type: Object })
    wsConnection;

    render() {

        return html`
            <header>Chat Title <button part="close">X</button></header>

            <ul part="chat">
                <li part="msg other">
                    <strong>Michael Lindsay</strong> hey - i really like this library https://some-other-thing<small>19:13</small>
                </li>
                <li part="msg other">
                    <strong>Michael Lindsay</strong>i think we should use it<small>19:13</small>
                </li>
                <li part="msg">
                    <strong>Devin Hartman</strong>I think this is easy to make...<small>19:13</small>
                </li>
            </ul>
            <footer>
                <input @input="${this.sendUpdate}" type="text" part="input" placeholder="Enter your message HERE..."><button part="close">&#x23E9;</button>
            </footer>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        // requestAnimationFrame(()=>{
            this.wsConnection = new WebSocket(this.url);

            this.wsConnection.onopen = this.onOpen;
            this.wsConnection.onclose = this.onClose;
            this.wsConnection.onerror = this.onErr;
            this.wsConnection.onmessage = this.onMsg;
        // })


    }

    onOpen(){
    console.log("🚀 ~ file: ws-chat.ts ~ line 122 ~ WsChat ~ onOpen ~ onOpen")
    }

    onClose(){
    console.log("🚀 ~ file: ws-chat.ts ~ line 127 ~ WsChat ~ onClose ~ onClose")
    }

    onMsg(message){
        console.log("🚀 ~ file: ws-chat.ts ~ line 144 ~ WsChat ~ onMsg ~ message", message)
        // try to decode json (I assume that each message
        // from server is json)
        try {
            var json = JSON.parse(message.data);
            console.log("🚀 ~ file: ws-chat.ts ~ line 149 ~ WsChat ~ onMsg ~ json", json)
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
        }
    }

    onErr(error){
    console.log("🚀 ~ file: ws-chat.ts ~ line 157 ~ onErr ~ error", error)
    }

    sendUpdate(event){
        let target = event.target;
        let message = target.value;
        this.wsConnection.send(message)

    }
}
