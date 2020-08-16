var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	app = express();

app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

mongoose.connect('mongodb://localhost/BlogApp', { useNewUrlParser: true, useUnifiedTopology: true });
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	createdOn: { type: Date, default: Date.now }
});
var Blog = mongoose.model('Blog', blogSchema);
// Blog.create(
// 	{
// 		title: 'test',
// 		image:
// 			'https://images.pingidentity.com/image/upload/f_auto,q_auto/ping_dam/content/dam/ping-6-2-assets/images/home-page/cubeguy.png'
// 	},
// 	function(error, Blog) {
// 		if (!error) {
// 			console.log(Blog);
// 		} else {
// 			console.log(error);
// 		}
// 	}
// );

app.get('/', function(req, res) {
	res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
	Blog.find({}, function(error, findBlogs) {
		if (!error) {
			res.render('index', { blogs: findBlogs });
		} else {
			console.log(error);
		}
	});
});

app.get('/blogs/new', function(req, res) {
	res.render('new');
});

app.post('/blogs', function(req, res) {
	// console.log(req.body);
	req.body.blog.description = req.sanitize(req.body.blog.description);
	Blog.create(req.body.blog, function(error, createdBlog) {
		if (!error) {
			res.redirect('/blogs');
		} else {
			console.log(error);
		}
	});
});

app.get('/blogs/:id', function(req, res) {
	Blog.findById(req.params.id, function(error, foundBlog) {
		if (!error) {
			res.render('show', { blog: foundBlog });
		} else {
			console.log(error);
		}
	});
});

app.get('/blogs/:id/edit', function(req, res) {
	Blog.findById(req.params.id, function(error, editBlog) {
		if (!error) {
			res.render('edit', { blog: editBlog });
		} else {
			console.log(error);
		}
	});
});

app.put('/blogs/:id', function(req, res) {
	req.body.blog.description = req.sanitize(req.body.blog.description);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, { new: true }, function(error, editedBlog) {
		if (!error) {
			res.render('show', { blog: editedBlog });
		} else {
			console.log(error);
		}
	});
});

app.delete('/blogs/:id', function(req, res) {
	Blog.findByIdAndDelete(req.params.id, function(error) {
		if (!error) {
			res.redirect('/blogs');
		} else {
			console.log(error);
		}
	});
});

app.listen(3000, () => {
	console.log('Restful Blog App server started on port 3000.');
});
