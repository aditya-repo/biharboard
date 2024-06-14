import bwipjs from "bwip-js"
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const barcodeGenrator = (id)=>{

    if (!id) {
        return {message: 'input not found'}
    }

    id = String(id)

    bwipjs.toBuffer({
        bcid:        'code128',
        text:        id,       
        scale:       3,      
        height:      8,       
        includetext: true,    
        textxalign:  'center', 
    }, function (err, png) {
        if (err) {
            console.log(id,err);
            return {message: 'barcode saving failed', error: err}
        } else { 

            // Define the path to save the barcode
            const filePath = path.join(__dirname,'..', 'barcodes', `${id}.png`);
            // Ensure the 'barcodes' directory exists
            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath));
            }
            // Write the PNG file to the specified path
            fs.writeFile(filePath, png, (err) => {
                if (err) {
                    return {message: 'barcode saving failed', error: err}
                } else {
                    return {type: 'barcode', path: filePath};
                }
            });
        }
    });
}

export { barcodeGenrator }