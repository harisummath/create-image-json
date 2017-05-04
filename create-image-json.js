'use strict'

const fs = require('fs');

fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
    let promises = [];
    let jsonFiles = [];
    let images = files.filter((fileName) => {
        let extension = fileName.substr(fileName.lastIndexOf('.')+1);
        return extension === 'png';
    });
    let movies = files.filter((fileName) => {
        let extension = fileName.substr(fileName.lastIndexOf('.')+1);
        return extension === 'mp4';
    });
    images.forEach((fileName) => {
        let promise = new Promise((resolve, reject) => {
            fs.stat(fileName, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }

                let name = fileName.substring(0, fileName.length - 4);
                let hasMovie = movies.some((movie) => { return movie.startsWith(name); });
                let image = {
                    name: name,
                    url: fileName,
                    size: stats.size,
                    uploaded: stats.birthtime,
                    movie: hasMovie ? name + '.mp4': null
                };
                jsonFiles.push(image);

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
