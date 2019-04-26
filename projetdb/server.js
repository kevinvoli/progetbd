let express = require('express')
let expressValidator = require('express-validator')
let session = require('express-session')
let bodyParser = require('body-parser')
let mysql = require('promise-mysql')
let io = require('socket.io')
mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'batiFacil_db'
}).then((db)=>{
    console.log('connexion réussi');
    let app = express()
    let server =require('http').createServer(app)
    let io = require('socket.io')(server)

    app.set('view engine','twig')
    const User = require('./model/user')(db)
    app.use(express.static(__dirname+'/views'))
    app.use('public',express.static(__dirname+'/views/public'))
    app.use(expressValidator())
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))


    app.get('/',(req,res)=>{
        res.render('index.twig')
    })
    app.get('/connexion',(req,res)=>{
        res.render('connexion.twig')
    })
    app.get('/inscription',(req,res)=>{
        res.render('inscription.twig')
    })
    app.get('/formation', async (req,res)=>{
        let getCategorie = await User.getCategorie()
        console.log(getCategorie)
        res.render('formation.twig',{element:getCategorie})
    })
    app.get('/profil',(req,res)=> {
        res.render('profil.twig')
    })
    app.get('/produits',(req,res)=> {
        res.render('produit.twig')
    })
    app.get('/forum',(req,res)=> {
        let sess = req.session.agri
        res.render('forum.twig',{sess:sess})
    })
    app.get('/view', async (req,res)=>{
        let setGroup = await User.getProducts()
        res.render('viewproduct.twig',{element:setGroup});
    })

    app.get('/forum/:id' , async (req,res) => {
        let sujet = await User.getSujet(req.params.id)
        let reponses = await User.getReponses(req.params.id)
        res.render("forum_sujet.twig" , {sujet : sujet, reponses : reponses, user: req.session.agri})
    })

    /* les poste du site */
    app.post('/',(req,res)=>{
    })
    app.post('/connexion', async (req,res)=>{
        req.check('email','email ne doit pas être vide').notEmpty(); 
        req.check('password','le mot de passe ne doit pas être vide').notEmpty(); 
        let error = req.validationErrors()
        if(error){
            res.render('connexion.twig',{errors:error})
        }
        else
        {
            let data = req.body
            console.log(data)
            let connex = await User.connexion(data);
            if(connex.id)
            {
                req.session.agri =  connex
                res.redirect('/forum')
            }
            else
            {
                let erreur=" cette information est inconnu dans notre base de données";
                res.render('connexion.twig',{erreur:erreur})
            }
        }
    })
    app.post('/inscription', async (req,res)=>{
        req.check('pseudo','le pseudo ne doit pas être vide').notEmpty(); 
        req.check('name','le nom ne doit pas être vide').notEmpty(); 
        req.check('lastname','le prenoms ne doit pas être vide').notEmpty(); 
        req.check('email','ce champ doit être un email et ne doit pas être vide').notEmpty().isEmail(); 
        req.check('tel','le téléphone  ne doit pas être vide').notEmpty().isNumeric(); 
        req.check('password','le mot de passe ne doit pas être vide').notEmpty(); 
        req.check('passwordC','le mot de passe  ne doit pas être vide').notEmpty();
        let error = req.validationErrors();
        if(error){
            res.render('inscription.twig',{errors:error})
        }
        else if(req.body.password = req.body.passwordC)
        {
            let erreur = "les mots de passe doivent être identiques"
            res.render('inscription.twig',{erreur: erreur})
        }
        else{
            let data = req.body
            console.log(data)
            let inscript = await User.inscription(data)
            if(inscript)
            {
                res.redirect('/forum.twig')
            }
            else
            {
                console.log('erreur lors de inscrition');
            }
        } 
    })
    app.post('/formation',async (req,res)=>{
        let data = req.body
        console.log(data)
        let setFormation = await User.setFormation(data)
     console.log(setFormation)
        if(setFormation)
        {
            res.redirect('/connexion')
        }
        else
        {
            res.redirect('/formation')
        }
    })
    app.post('/profil',async (req,res)=> {
        res.render('profil.twig')
    })

    app.post('/produits',async (req,res)=> {
        let info = req.body
        let setProduit = await User.setProduits(info)
        console.log(setProduit)
        if(setProduit)
        {
            res.redirect('/connexion')
        }
        else
        {
            res.redriect('/inscripton')
        }
    })





    // SOCKET DE COMMENTAIRE ET REPONSE




    io.on('connection',socket=>{

        console.log('New user connected')

        socket.on('sendResponse',async (data,clb)=>{
            let re = User.insertReponse(data)
            let post = await User.getReponses(data.sujet_id)
            if(re){
                socket.broadcast.emit('newMessage' , post[0])
                clb(post[0])
            }
            else
                clb(false)
        })
        
        socket.on('postMessage',(data,clb)=>{
            console.log(data)
            const setSujet = User.setForumSujet(data)
            if(setSujet){
                clb(true)
            } else {
                clb(false)
            }
        })


    })











    server.listen(8080,console.log("vous ecoter sur le port 8080" ))

}).catch((error)=>{
    console.log('error de connexion'+ error);
})
