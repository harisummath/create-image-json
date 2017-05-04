'use strict'

const fs = require('fs');

const acceptedExtensions = ['png', 'mp4']

fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
    let promises = [];
    let jsonFiles = [];
    files.forEach((fileName) => {
        let promise = new Promise((resolve, reject) => {
            fs.stat(fileName, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!stats.isFile()) {
                    resolve();
                    return;
                }

                let extension = fileName.substr(fileName.lastIndexOf('.')+1);
                if (acceptedExtensions.indexOf(extension) < 0) {
                    resolve();
                    return;
                }

                let file = { name: fileName, url: fileName, size: stats.size, uploaded: stats.birthtime };
                jsonFiles.push(file);

                resolve();
            });
        });
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        fs.writeFile('images.json', JSON.stringify(jsonFiles), (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Found ${jsonFiles.length} items. Created ${__dirname + '\\images.json' }. All done!`);
        });
    });
})
