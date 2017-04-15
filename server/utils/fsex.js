const fs = require('fs')

module.exports = {
    readdir: dir => new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err)
            }
            console.log(files)
            resolve(files)
        })
    })
    ,
    readFile: path => new Promise(function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    }).then(function (data) {
        console.log(data)
        return data
    }, function (err) {
        console.log(err)
        return err
    })
}