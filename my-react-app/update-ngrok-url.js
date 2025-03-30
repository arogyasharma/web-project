import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, 'src', 'config.js');

async function getNgrokUrl() {
    try {
        const response = await axios.get('http://localhost:4040/api/tunnels');
        const publicUrl = response.data.tunnels[0].public_url;
        return publicUrl;
    } catch (error) {
        console.error('Error getting Ngrok URL:', error.message);
        return null;
    }
}

async function updateConfigFile(ngrokUrl) {
    try {
        let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
        
        // Update the URL in the config file
        const newConfig = configContent.replace(
            /const cleanUrl = '.*?';/,
            `const cleanUrl = '${ngrokUrl}'.trim().replace(/\\/$/, '');`
        );
        
        fs.writeFileSync(CONFIG_FILE, newConfig);
        console.log(`Updated config.js with new Ngrok URL: ${ngrokUrl}`);
    } catch (error) {
        console.error('Error updating config file:', error.message);
    }
}

async function main() {
    console.log('Starting Ngrok URL monitor...');
    
    while (true) {
        const ngrokUrl = await getNgrokUrl();
        if (ngrokUrl) {
            await updateConfigFile(ngrokUrl);
        }
        // Wait for 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

main().catch(console.error); 