var bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	express = require("express"),
	app = express(),
	mongoose = require("mongoose");


mongoose.connect("mongodb+srv://vikram:vikram@practice-kpo5w.mongodb.net/test?retryWrites=true&w=majority");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Blog = mongoose.model("Blog", blogSchema);

// To add a blog manually
// Blog.create({
// 	title: "My Blog",
// 	image: "image url",
// 	body : "write your blog content"
// });

// Here goes routes, basic setup done

//Home page
app.get("/", function (req, res) {
	res.redirect("/blogs");
});

//Home page
app.get("/blogs", function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log("error");
		} else {
			res.render("index", {
				blogs: blogs
			});
		}
	});
});

// request for new Blog
app.get("/blogs/new", function (req, res) {
	res.render("new");
});

// post route for new Blog
app.post("/blogs", function (req, res) {
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// show the blog
app.get("/blogs/:id", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {
				blog: foundBlog
			});
		}
	});
});

// edit your blog
app.get("/blogs/:id/edit", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {
				blog: foundBlog
			});
		}
	});
});

// edit your blog update
app.put("/blogs/:id", function (req, res) {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updateBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// delete the blog
app.delete("/blogs/:id", function (req, res) {
	if (req.params.id === "5d43362284dee562e635c477") {
		res.redirect("/blogs");
	} else {
		Blog.findByIdAndRemove(req.params.id, function (err) {
			if (err) {
				res.redirect("/blogs");
			} else {
				res.redirect("/blogs");
			}
		});
	}
});

//to start the server
app.listen(process.env.PORT || 3000, function () {
	var date = new Date();
	var time = date.getHours();
	time += ":";
	time += date.getMinutes();
	time += ":";
	time += date.getSeconds();
	console.log("server started at " + time);
});