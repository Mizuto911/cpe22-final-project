import ngrok from '@ngrok/ngrok';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

let listener: ngrok.Listener | undefined;

const startNgrok = async() => {
    try {
        listener = await ngrok.connect({
            addr: 'http://localhost:3000',
            authtoken: process.env.NGROK_AUTHTOKEN,
            host_header: 'rewrite'
        });

        console.log(`Tunnel established at ${listener.url()}`);
        console.log(`Forwarding ${listener.url()} to localhost:3000`);
    }
    catch(e) {
        console.log(`Error Starting Tunnel: ${e}`)
    }
};

process.on('SIGINT', async() => {
    console.log('Shutting Down Server Tunnel');
    if(listener) {
        listener.close();
    }
    await ngrok.kill();
    process.exit();
});

startNgrok().then(() => setInterval(() => {},1000));