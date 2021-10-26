let fs = require("fs");
const { type } = require("os");
let path = require("path");


let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function organizeFn(dirPath){

    let destPath;
    if(dirPath == undefined){
        destPath = process.cwd();
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            destPath = path.join(dirPath , "organized_files");
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);
            }
        }else{
            console.log("kindly enter the correct path");
            return;
        }
    }

    organizeHelper(dirPath, destPath);
    
}

function organizeHelper(src, dest){

    let childNames = fs.readdirSync(src);
    for(let i=0;i<childNames.length;i++){
        let childadress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childadress).isFile();
        if(isFile){
            let category = getCategory(childNames[i]);
            // cls
            // console.log(childNames[i] , "  "  ,category)
            sendFiles(childadress, dest, category);
        }
    }

}

function sendFiles(src, dest, category){


    if(category == undefined){
        return;
    }

    let categoryPath = path.join(dest, category);

    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    console.log(categoryPath);
    let fileName = path.basename(src);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(src, destFilePath);
    fs.unlinkSync(src);
    // console.log(src, "  ", dest, "  ", category);
}

function getCategory(names){

    let ext = path.extname(names);
    ext = ext.slice(1);
    for(let type in types){
        let ctype = types[type];
        for(let i=0;i<ctype.length;i++){
            if(ext === ctype[i]){
                return type;
            }
        }
    }

}

module.exports = {
    organizeKey: organizeFn
}