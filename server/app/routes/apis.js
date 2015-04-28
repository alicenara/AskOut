/* 
*  APIs File -> User, Events, Assistencia?
*/

var Event = require('../models/event');
var User = require('../models/user');

module.exports = function(app,express) {
    var apiRouter = express.Router();

    apiRouter.use(function(req, res, next) {

        // log each request to the console
        console.log(req.method, req.url);

        // continue doing what we were doing and go to the route
        next();
    });

    apiRouter.get('/',function(req,res) {
        res.json("Apis main page");
    });

    /********************************************************************************
     Events API! :D
    ********************************************************************************/
    apiRouter.route('/events')
        .get(function(req,res){
            Event.find(function(err,events){
                if(err) res.send(err);

                res.json(events);
            });
        });

        /* Post is not necessary due to we only add events with our script, but I want to do the api for future features */
        .post(function(req,res){
            var e = new Event();
            e.data_inici = req.body.data_inici;
            e.data_final = req.body.data_final;
            e.titol = req.body.titol;
            e.descripcio = req.body.descripcio;
            e.web = req.body.web;

            e.save(function(err){
                if (err) res.send(err);
                res.json("Event created");
            });
        });
    

    /*
    eventRouter.route('/postEvents')
      .get(function(req,res){
        var event = new Event();
        
        event.data_inici = new Date();
        event.data_final = new Date();
        event.titol = "primer event";
        event.descripcio = "descripcio cutre";
        event.web = "who knows";

        event.save(function(err) { 
          if (err) {
            return res.send(err);
          }
          res.send("done");
        });    
      }); */


    /********************************************************************************
     Users API! :D
    ********************************************************************************/

    apiRouter.route('/users')
        .get(function(req,res){
            User.find(function(err,users){
                if(err) res.send(err);

                res.json(users);
            });
        });

        .post(function(req,res){
            var u = new User();
            u.fbToken = req.body.fbToken;
            u.privacitat = req.body.privacitat;

            u.save(function(err){
                if (err) res.send(err);
                res.json("User created");
            });
        });
    
    return apiRouter;
}

