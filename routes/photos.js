// photo model 可以操作数据库
var Photo = require('../models');
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var photos = [{
    name: 'hahah',
    path: 'img1.jpg'
}];

exports.list = function(req, res) {

    Photo.find({}, function(err, photoObj) {
        if (err) console.log(err);
        console.log(photoObj)
        console.log(1)
        res.render('photos', {
            title: 'Photos',
            photos: photoObj
        })
    })
}

exports.form = function(req, res) {
    console.log(1)
    res.render('form', {
        title: '上传图片'
    })
}

exports.upload = function(dir) {
    return function(req, res, next) {
        var form = new formidable.IncomingForm();
        form.uploadDir = dir;
        form.parse(req, function(err, fields, files) {
            var name = fields.name;
            var ext = path.extname(files.photo.name);
            var oldPath = files.photo.path
            var newPath = files.photo.path + ext;
            fs.rename(oldPath, newPath, function(err) {
                if (err) console.log(err);
            });
            // F:\node\littleAlbulm\public\photos\upload_a566d50fb63c37213b66f3f8814e1b3a.jpg
            var photo = new Photo({
                name: name,
                path: newPath.split('public')[1]
            });
            photo.save(function(err) {
                if (err) console.log(err);
                // res.redirect('/');
                return;
            })
            console.log(files.photo)
            console.log('--------')
            console.log(files.photo.path)
            res.send(util.inspect({ fields: fields, files: files }));

        });
    }
}
