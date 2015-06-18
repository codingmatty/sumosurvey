exports.index = function(req, res){
  res.render('index.html');
};

exports.loggedin = function(req, res) {
    if (req.isAuthenticated()) {
        res.json({authenticated: true});
    } else {
        res.sendStatus(401);
    }
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};