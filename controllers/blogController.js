const mongoose = require('mongoose');
const shortid = require('shortid');

const blogsModelSchema = require('../models/Blog')

mongoose.model('Blog', blogsModelSchema.blogSchema)

const blogModel = mongoose.model('Blog');

let getAllBlog = (req, res) => {

    blogModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {

            if(err){
                console.log(err)
                logger.error(err.message, 'Blog Controller: getAllBlog', 10)
                let apiResponse = response.generate(true, 'failed to Find Blog Details', 500, null)
                res.send(apiResponse)
            }else if(check.isempty(result)){
                logger.info('No Blog Found', 'Blog Controller: getAllBlog')
                let apiresponse = response.generate(true, 'No Blog Found', 404, null)
                res.send(apiResponse)
                res.send("No blog found")
            }else {
                let apiResponse = response.generate(false, 'All blog details found', 200, result)
                res.send(apiResponse)
            }

        })
}


let viewByBlogId = (req, res) => {

    if(check.isempty(req, params.blogId)){
        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    }else{

    blogModel.findOne({'blogId': req.params.blogId}, (err, result) => {

        if(err){
            logger.error(`error Occured: ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured', 500, null)
            res.send(apiresponse)
        } else if(check.isempty(result)){
            console.log('No Blog found')
            let apiResponse = response.generate(true, 'blog not found', 500, null )
            res.send(apiResponse)
        }else{
            logger.info("Blog found successfully", "BlogController: viewBlogById", 5)
            let apiResponse = response.generate(false, 'Blog FOund Successfully', 200, result)
            res.send(apiResponse)
        }

    })

    }

}

let createBlog = (req, res) => {

    var today = Date.now()
    let blogId = shortid.generate()

    let newBlog = new blogModel({

        blogId : blogId,
        title : req.body.title,
        description : req.body.description,
        bodyHtml: req.body.blogBody,
        isPublished : true,
        category : req.body.category,
        author : req.body.fullName,
        created: today,
        lastmodified: today

    })

    let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '')? req.body.tags.split(','):[]
    newBlog.tags = tags

    newBlog.save((err, result) => {

        if(err){
            console.log(err)
            res.send(err)
        }else{
            res.send(result)
        }

    })

}

let editBlog = (req, res) => {

    let options = req.body;
    console.log(options);

    blogModel.update({ 'blogId': req.params.blogId}, options, { multi: true}).exec((err, result) => {

        if(err) {
            console.log(err)
            res.send(err)
        }else if(result == undefined || result == null || result == ''){
            console.log('No Blog Founf')
            res.send("No blog found")
        }else {
            res.send(result)
        }

    })

}

let viewByCategory = (req,res) => {
    blogModel.find({'category': req.params.category}, (err, result) => {
    if(err){
        console.log(err)
        res.send(err)
    }else if(result == undefined || result == null || result == ''){
        console.log("no result found");
        res.send("No blog found");
    }else {
        res.send(result)
    }
})

}

let viewByAuthor = (req, res) => {
    blogModel.find({'author' : req.params.author}, (err,result) => {
        if(err){
            console.log(err)
            res.send(err)
        }else if(result == undefined || result == null || result == ""){
            console.log("No blog found");
            res.send("No Bog found");
        }else{
            res.send(result);
        }
    })
}

let deleteBlog = (req, res) => {

    blogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {
        if(err){
            console.log(err)
            res.send(err)
        }else if(result == undefined || result == null || result == ''){
            console.log('No blog found');
            res.send('No Blog Found');
        }else {
            res.send(result)
        }
    })

}

let increaseBlogView = (req, res) => {

    blogModel.findOne({'blogId': req.params.blogId }, (err, result) => {

        if(err) {
            console.log(err)
            res.send(err)
        }else if(result == undefined || result == null || result == ''){
            console.log('No Blog found');
            res.send('No Blog Found')
        }else {

            result.views += 1;
            result.save(function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log("Blog Updated successfuly");
                    res.send(result)
                }
            });
        }

    })

}

let namesake = (req, res) => {
    
    let fullName = req.query.fullName;
    let names = [];

    names = fullName.split(' ');

    let details = {
	firstName : names[0],
	lastName : names[1]
	};
	
    res.send(details);
}

let agesake = (req, res) => {

    let date = new Date(req.query.dob).getFullYear();
    let todayDate = new Date();
    let age = todayDate.getFullYear() - new Date(date);

    let ageDetails = {
	age : age
    };
    res.send(ageDetails);
}

module.exports = {

    getAllBlog : getAllBlog,
    createBlog : createBlog,
    viewByBlogId : viewByBlogId,
    editBlog : editBlog,
    viewByAuthor : viewByAuthor,
    deleteBlog : deleteBlog,
    increaseBlogView : increaseBlogView,
    viewByCategory : viewByCategory,
    namesake : namesake,
    agesake : agesake

}