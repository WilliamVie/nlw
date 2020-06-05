const express = require("express")
const server = express()
//Configurar pasta pública

server.use(express.static("public"))

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
    return res.render("create-point.html", { title: "Seu marketplace de coleta de resíduos" })
})


server.get("/search", function(req, res){
    return res.render("search-results.html", { title: "Seu marketplace de coleta de resíduos" })
})

//Ligar o servidor
server.listen(3000)
