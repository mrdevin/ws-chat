import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement("ws-chat")
export class WsChat extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column;
            border-radius: 10px;
            overflow: hidden;
            --max-height: 200px;
            /* height:  var(--max-height); */
            max-height:  var(--max-height);
            width: clamp(30ch, 100px, 400px);
            /* transform: translateY(-100%); */
            transition: all 800ms cubic-bezier(0.175, 0.885, 0.52, 1.275);

            header,
            [part~=chatStart] {
                height: 0;
                min-height: 0;
                /* overflow: hidden; */
                /* display: none; */
                transition: all 800ms cubic-bezier(0.175, 0.885, 0.52, 1.275);
            }


        }

        :host([username]){
            max-height: 500px;
            width: clamp(30ch, 400px, 400px);
            transform: translateY(0);
            header,
            [part~=chatStart] {
                height: 40px;
                transition: all 800ms cubic-bezier(0.175, 0.885, 0.52, 1.275);
            }
        }

        header,
        [part~="chat"],
        [part~="chatStart"],
        footer {
            display: flex;
            margin:0;
            padding: 0;
        }

        header,
        footer{
            display: fixed;
            background-color: darkgrey;
            min-height: 40px;
            padding: 5px;
            /* box-sizing: border-box; */
        }

        header{
            top: 0;
            align-items: center;
            justify-content: center;
            padding: 5px;
        }

        footer{
            bottom: 0;
        }

        [part~="close"] {
            justify-self: flex-end;
            margin-left: auto;
        }

        [part~=chat],
        [part~=chatStart] {
            flex-wrap: nowrap;
            flex-direction: column;
            background-color: white;
            flex: 1;
            justify-content: flex-end;
            padding: 0px 5px;
            max-height: 100%;
        }

        [part~=chat] {
            /* height: calc(100% - 80px); */
            /* overflow: hidden; */
            /* overflow-x: scroll; */
        }

        [part~=chatStart] {
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
        }

        [part~="msg"] {
            display: block;
            background-color: sienna;
            color: white;
            border-radius: 10px;
            box-sizing: border-box;
            max-width: 75%;
            padding: 5px;
            margin: 10px 0;
            align-self: flex-start;
        }

        [part~="other"] {
            background-color: white;
            border-color: sienna;
            border: 1px solid sienna;
            color: sienna;
            align-self: flex-end;
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
    url = 'ws://0.0.0.0:1337';

    @property({ type: Object })
    wsConnection;

    @property({ type: String, reflect: true })
    userName;

    @property({ type: Array })
    messages = [
        {
            time: 930849180000,
            text: "hey - i really like this library https://some-other-thing",
            author: "Michael Lindsay"
        },{
            time: 930849180000,
            text: "i think we should use",
            author: "Michael Lindsay"
        },{
            time: 1629834295135,
            text: "I think this is easy to make...",
            author: "Devin Hartman"
        }
    ];

    renderMsgArea(){
        return this.userName
        ? html`
            <ul part="chat">
                ${this.messages.map((msg) => html`
                    <li part="msg ${this.isOther(msg)}" >${msg.author}: ${msg.text} <time>${new Date(msg.time).toLocaleTimeString()}</time></li>
                `)}
            </ul>
        `
        : html`<div part="chatStart">Please add username below</div>`;
    }

    render() {

        return html`
            <header>Chat Title
                <button part="close">X</button>
            </header>

            <ul part="chat">
                ${this.renderMsgArea()}

            </ul>
            <footer>
                <input @keydown="${this.handleInputKey}"  id="msg" type="text" part="input" placeholder="${this.placeholder}"/>
                <button @click="${this.sendUpdate}" part="close">&#x23E9;</button>
            </footer>
        `;
    }

    get placeholder(){
        if(!this.userName){
            return "Please Provide a UserName";
        }else{
            return "Enter your message HERE...";
        }
    }

    get isSafari(){
        var userAgent = window.navigator.userAgent;
        console.log("🚀 ~ file: ws-chat.ts ~ line 164 ~ WsChat ~ getisSafari ~ userAgent", userAgent,userAgent.match(/iPad/i) , userAgent.match(/iPhone/i))

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            // iPad or iPhone
            return true;
        }
        else {
            return false;
        }
    }

    isOther(msg){
        if(msg.author === this.userName){
            return '';
        }else{
            return 'other';
        }
    }

    connectedCallback() {
        super.connectedCallback();
        // requestAnimationFrame(()=>{
            this.wsConnection = new WebSocket(this.url);

            this.wsConnection.onopen = this.onOpen.bind(this);
            this.wsConnection.onclose = this.onClose.bind(this);
            this.wsConnection.onerror = this.onErr.bind(this);
            this.wsConnection.onmessage = this.onMsg.bind(this);
        // })
    }

    onOpen(){
        console.log("🚀 ~ file: ws-chat.ts ~ line 122 ~ WsChat ~ onOpen ~ onOpen")
    }

    onClose(){
        console.log("🚀 ~ file: ws-chat.ts ~ line 127 ~ WsChat ~ onClose ~ onClose")
    }

    onMsg(message){
        // console.log("🚀 ~ file: ws-chat.ts ~ line 144 ~ WsChat ~ onMsg ~ message", message)
        // try to decode json (I assume that each message
        // from server is json)
        try {
            var json = JSON.parse(message.data);
            // console.log("🚀 ~ file: ws-chat.ts ~ line 149 ~ WsChat ~ onMsg ~ json", json)
            if(json.type === 'message'){
                this.messages.push(json.data)
                this.messages = this.messages.slice()
            }
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
        }
    }

    onErr(error){
        console.log("🚀 ~ file: ws-chat.ts ~ line 157 ~ onErr ~ error", error)
    }

    handleInputKey(event){
    // console.log("🚀 ~ file: ws-chat.ts ~ line 205 ~ WsChat ~ handleInputKey ~ event", event.code)
        if(event.code === "Enter"  || event.code === "NumpadEnter"){
            this.sendUpdate(event);
        }
    }

    sendUpdate(_event){
        let target = this.shadowRoot.querySelector('#msg') as HTMLInputElement;
        let message = target.value;

        if(!this.userName){
            this.userName = target.value;
        }

        this.wsConnection.send(message);
        target.value = '';

        if(!this.isSafari){
            target.focus();
        }else{
            target.blur();
        }
    }
}
