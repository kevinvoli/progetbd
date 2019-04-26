let db
module.exports = (_db)=>{
    db = _db;
    return User
}
 let User = class {
        static connexion(data){
            return new Promise((next)=>{
                db.query('SELECT * FROM users WHERE email = ? AND password = ?',[data.email,data.password])
                    .then((result)=>{
                        if(result[0] !== undefined)
                        {
                            next(result[0])
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

         static inscription(data){
             return new Promise((next)=>{
                 db.query('INSERT INTO users (pseudo,name,lastname,tel,email,password) VALUES(?,?,?,?,?,?)',[data.pseudo,data.name,data.lastname,data.tel,data.email,data.password])
                     .then((result)=>{
                         if(result)
                         {
                             next(result)
                         }
                         else
                         {
                             next(new Error('erreur lors de la connexion'))
                         }
                     })
                     .catch((error)=>{
                         next(error)
                     })
             })
         }

         static setForumSujet(data){
            return new Promise((next)=>{
                db.query('INSERT INTO forum_sujet (user_id,categori_id,sujet,content,date_send) VALUES(?,?,?,?,NOW())',[data.user_id,data.categori_id,data.sujet,data.content])
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static setFormation(data){
            return new Promise((next)=>{
                db.query('INSERT INTO formations (culture,categori_id,admin_id,title,photo,content,date_send) VALUES(?,?,"5",?,"user.jpg",?,NOW())',[data.culture,data.categorie,data.titre,data.description])
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static setProduits(data){
            return new Promise((next)=>{
                db.query('INSERT INTO produits (libelle,quantite,prix,description,user_id,date_send) VALUES(?,?,?,?,"5",NOW())',[data.libelle,data.quantite,data.prix,data.description])
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static getFormation(){
            return new Promise((next)=>{
                db.query('SELECT * FROM formations')
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static getCategorie(){
            return new Promise((next)=>{
                db.query('SELECT * FROM categories')
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static getProducts(){
            return new Promise((next)=>{
                db.query('SELECT * FROM produits')
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static setForumSujet(data){
            return new Promise((next)=>{
                db.query('INSERT INTO forum_sujet (user_id,categori_id,sujet,content,date_send) VALUES(?,?,?,?,NOW())',[data.user_id,data.categori_id,data.sujet,data.content])
                .then((result)=>{
                        if(result)
                        {
                            next(result)
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }

        static getSujet(id){
            return new Promise((next) => {
                db.query('SELECT s.*,a.pseudo FROM `forum_sujet` s, users a WHERE s.id=? and s.user_id=a.id', [id])
                    .then((result) => {
                        if(result)
                            next(result[0])
                        else
                            next(new Error('erreur lors de la connexion'))
                    })
                    .catch(error => next(error))
            })
        }
        static getReponses(id_sujet){
            return new Promise((next) => {
                db.query('SELECT s.*,a.pseudo,a.id FROM `forum_post` s, users a WHERE s.sujet_id=? and s.user_id=a.id order by date_send desc', [id_sujet])
                    .then((result) => {
                        if(result)
                            next(result)
                        else
                            next(new Error('erreur lors de la connexion'))
                    })
                    .catch(error => next(error))
            })
        }

        static insertReponse(data){
            return new Promise((next)=>{
                db.query('INSERT INTO forum_post (sujet_id, user_id, content, date_send) VALUES(?,?,?,NOW())',[data.sujet_id,data.user_id,data.content])
                    .then((result)=>{
                        if(result)
                        {
                            next(this.getReponses(data.sujet_id))
                        }
                        else
                        {
                            next(new Error('erreur lors de la connexion'))
                        }
                    })
                    .catch((error)=>{
                        next(error)
                    })
            })
        }
   
 }