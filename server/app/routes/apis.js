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
        res.send("Apis main page <br> Get all events -> GET /events <br> Insert events -> POST /events <br> Get events per categoria general -> GET /events/:categories_generals <br> Get all users -> GET /users <br> Get interessos per ID user -> GET /users/:idUser <br> Save fbToken and get ID -> GET /desarUser/:fbToken <br> A user goes to an event -> GET /anarEvent/:idUser/:idEvent");
    });

    /********************************************************************************
     Events API! :D
    ********************************************************************************/
    apiRouter.route('/events')
        .get(function(req,res){
            Event.find(function(err,events){
                if(err) res.send(err);

                res.json(events);
            }).limit(200);//.limit(15);
        })

        /* Post is not necessary due to we only add events with our script, but I want to do the api for future features */
        .post(function(req,res){
            var e = new Event();
            e.data_inici = req.body.data_inici;
            e.data_final = req.body.data_final;
            e.titol = req.body.titol;
            e.descripcio = req.body.descripcio;
            e.categoria = req.body.categoria;
            e.web = req.body.web;

            e.save(function(err){
                if (err) res.send(err);
                res.json("Event created");
            });
        });

    apiRouter.route('/events/:categories_generals')
        // get the event with that categoria
        .get(function(req, res) {
            //res.send('{categoria : '+req.params.categoria+'}');
            Event.find({categories_generals : req.params.categories_generals }, function(err, result) {
            if (err) res.send(err);
            // return that user
            res.json(result);
            }).limit(200);
        });
    

    /*
    apiRouter.route('/postEvents')
      .get(function(req,res){
        var event = new Event();
        
        event.data_inici = new Date();
        event.data_final = new Date();
        event.titol = "primer event";
        event.descripcio = "descripcio cutre";
        event.categoria = "esport";
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
        })

        .post(function(req,res){
            var u = new User();
            u.fbToken = req.body.fbToken;
            u.interessos = req.body.interessos;
            u.events = [];
            u.save(function(err){
                if (err) res.send(err);
                res.json("User created");
            });
        });

    apiRouter.route('/users/:idUser')
        .get(function(req,res){
            User.find({_id : req.params.idUser},'-_id interessos', function(err,users){
                if(err) res.send(err);
                res.json(users);
            });
        })

        .post(function(req,res){
                User.find({_id : req.params.idUser},'-_id interessos', function(err,users){
                if(err) res.send(err);

                res.json(users);
            });
        });

    apiRouter.route('/anarEvent/:idUser/:idEvent')
        .get(function(req,res){
            User.findOne({_id : req.params.idUser}, function(err,usuari){
                if(err) res.send(err);
                var arrayEvents = usuari.events;
                var i = 0;
                while (arrayEvents[i]!== req.params.idEvent && i < arrayEvents.length){
                    i++;
                }
                if (i>=arrayEvents.length){
                    usuari.events.push(req.params.idEvent);                    
                    usuari.save(function(err){
                        if (err) res.send(err);
                        res.send("desat");
                    });
                }else{
                    res.send("trobat");
                }
            });
        });

    apiRouter.route('/desarUser/:fbToken')
        .get(function(req,res){
            User.findOne({fbToken: req.params.fbToken}, function(err,usuari){
                if(err) res.send(err);
                if (usuari !== null && usuari !== undefined && usuari._id !== null && usuari._id !== undefined){
                    res.send(usuari._id);
                }else{
                    var u = new User();
                    u.fbToken = req.params.fbToken;
                    u.save(function(err){
                        if (err) res.send(err);
                        res.send(u._id);
                    });
                }                
            });             
        });
    /*
    apiRouter.route('/users/:idUser/:interes')
        .post(function(req,res){
            User.find({_id : req.params.idUser, 'interessos.titol' : req.params.interes},'-_id interessos.interes', function(err,users){
                if(err) res.send(err);

                res.json(users);
            });
        });*/
    
    return apiRouter;
}

