"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ngrok_1 = __importDefault(require("@ngrok/ngrok"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let listener;
const startNgrok = async () => {
    try {
        listener = await ngrok_1.default.connect({
            addr: 'http://localhost:3000',
            authtoken: process.env.NGROK_AUTHTOKEN,
            host_header: 'rewrite'
        });
        console.log(`Tunnel established at ${listener.url()}`);
        console.log(`Forwarding ${listener.url()} to localhost:3000`);
    }
    catch (e) {
        console.log(`Error Starting Tunnel: ${e}`);
    }
};
process.on('SIGINT', async () => {
    console.log('Shutting Down Server Tunnel');
    if (listener) {
        listener.close();
    }
    await ngrok_1.default.kill();
    process.exit();
});
startNgrok().then(() => setInterval(() => { }, 1000));
