const express = require("express")
const server = express()
//Configurar pasta pública

const db = require("./database/db.js")

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

//Utilizando tamplate engine

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurar caminhos
//req: Requisição
//res: Resposta
server.get("/", function(req, res){
    return res.render("index.html")
})



server.get("/create-point", function(req, res){
    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //console.log(req.body)
    //inserir dados no banco

    const query = `
        INSERT INTO places(
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        )VALUES(?,?,?,?,?,?,?);
    `
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]

        function afterInsertData(err){
            if(err){
                console.log(err)
                return res.send("Erro no cadastro")
            }

            console.log("Cadastrado com sucesso!")
            console.log(this)

            return res.render("create-point.html", { saved: true })
        }
    db.run(query, values, afterInsertData)
})

server.get("/search", function(req, res){

    const search = req.query.search

    if(search == ""){
        //Pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    //Pegar os dados do banco
    db.all(`SELECT * FROM places WHERE city like '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length

        console.log("Aqui estão os registros")
        console.log(rows)

        //Mostrar a página html com os dados do banco
        return res.render("search-results.html", { places: rows, total: total })
    })
})

//Ligar o servidor
server.listen(3000)
