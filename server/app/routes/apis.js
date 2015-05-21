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
        res.send("Apis main page <br> Get all events -> GET /events <br> Get today's events -> GET /eventsAvui <br> Insert events -> POST /events <br> Get events per categoria general -> GET /events/:categories_generals <br> Get all users -> GET /users <br> Get interessos per ID user -> GET /users/:idUser <br> Save fbToken and get ID -> GET /desarUser/:fbToken <br> A user goes to an event -> GET /anarEvent/:idUser/:idEvent <br> Save interest -> GET /users/:idUser/:interes/:bool");
    });

    /********************************************************************************
     Events API! :D
    ********************************************************************************/
    apiRouter.route('/events')
        .get(function(req,res){
            var today = new Date();
            var tomorrow = today;
            tomorrow.setDate(tomorrow.getDate()+1);
            Event.find({"data_inici": {"$gte": tomorrow}},function(err,events){
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

    apiRouter.route('/eventsAvui')
        .get(function(req,res){
            var today = new Date();
            var tomorrow = today;
            tomorrow.setDate(tomorrow.getDate()+1);
            Event.find({"data_inici": {"$gte": today, "$lt": tomorrow}},function(err,events){
                if(err) res.send(err);

                res.json(events);
            }).limit(200);//.limit(15);
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
    
    apiRouter.route('/eventUsers/:idEvent')
        .get(function(req,res){
            Event.findOne({_id : req.params.idEvent}, function(err,events){
                if(err) res.send(err);
                User.find({ '_id' : { $in : events.users }}, function(err,users){
                    if(err) res.send(err);
                    res.json(users);
                });
            });
        });

    apiRouter.route('/eventUsers/:idEvent')
        .get(function(req,res){
            Event.findOne({_id : req.params.idEvent}, function(err,events){
                if(err) res.send(err);
                User.find({ '_id' : { $in : events.users }}, function(err,users){
                    if(err) res.send(err);
                    res.json(users);
                });
            });
        });

    /*apiRouter.route('/eventAvuiCat/:categories')
        .get(function(req,res){
            var cats = (req.params.categories).split('-');
            Event.find({ $and:[ {"data_inici": {"$gte": today, "$lt": tomorrow}}, {"categories_generals" : $in { cats }} ]}, function(err,events){
                if(err) res.send(err);

                res.json(events);
            }).limit(200);//.limit(15);
        });*/

    /********************************************************************************
     Users API! :D
    ********************************************************************************/

    //Show all users
    apiRouter.route('/users')
        .get(function(req,res){
            User.find(function(err,users){
                if(err) res.send(err);

                res.json(users);
            });
        })
        //Save users
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
     //Show events users
    apiRouter.route('/userEvents/:idUser')
        .get(function(req,res){
            User.findOne({_id : req.params.idUser}, function(err,users){
                if(err) res.send(err);
                Event.find({ '_id' : { $in : users.events }}, function(err,events){
                    if(err) res.send(err);
                    res.json(events);
                });
            });
        });

    //Show interessos users
    apiRouter.route('/userInterest/:idUser')
        .get(function(req,res){
            User.findOne({_id : req.params.idUser},function(err,users){
                if(err) res.send(err);
                res.json(users.interessos);
            });
        });
    //Add interessos to user
    apiRouter.route('/users/:idUser/:interes/:bool')
        .get(function(req,res){
            User.findOne({_id : req.params.idUser}, function(err,usuari){
                if(err) res.send(err);
                var arrayInteressos = usuari.interessos;
                var i = 0;
                while (i < arrayInteressos.length && arrayInteressos[i].titol !== req.params.interes){
                    i++;
                }
                if (i>=arrayInteressos.length){                     
                    usuari.interessos.push({ titol : req.params.interes, interes : req.params.bool });
                }else{
                    usuari.interessos[i].interes = req.params.bool;
                }
                usuari.save(function(err){
                    if (err) res.send(err);
                    res.send("done");
                });
            });
        });

    //Add user to event
    apiRouter.route('/anarEvent/:idUser/:idEvent')
        .get(function(req,res){
            User.findOne({_id : req.params.idUser}, function(err,usuari){
                if(err) res.send(err);   
                var arrayEvents = usuari.events;

                var i = 0;
                while (i < arrayEvents.length && arrayEvents[i]!== req.params.idEvent){
                    i++;
                }
                if (i>=arrayEvents.length){
                    usuari.events.push(req.params.idEvent);                    
                    usuari.save(function(err){
                        if (err) res.send(err);
                        Event.findOne({_id : req.params.idEvent}, function(err,eventTrobat){
                            if(err) res.send(err);
                            eventTrobat.users.push(req.params.idUser);
                            eventTrobat.save(function(err){
                                if (err) res.send(err);
                                res.send("desat");
                            });
                        });                        
                    });
                }else{
                    res.send("trobat");
                }
            });
        });
    //Add user with fbToken
    /*apiRouter.route('/desarUser/:fbToken')
        .get(function(req,res){
            var options = {
                host: 'graph.facebook.com',
                port: 443,
                path: '/app/?access_token='+req.params.fbToken,
                method: 'GET'
            };
            var options2 = {
                host: 'graph.facebook.com',
                port: 443,
                path: '/me?access_token='+req.params.fbToken,
                method: 'GET'
            };
            var comprovarFB = require('./fbConnection');
            comprovarFB(options,options2,function(resultat){
                console.log(resultat);
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
        });*/
    
    return apiRouter;
}

