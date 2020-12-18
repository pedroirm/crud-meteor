if (Meteor.isServer) {
    // Inicia uma collection chamada user
    Meteor.startup(function () {
        User = new Meteor.Collection('user');
    });

    // Rota do tipo get para listar todos os usuarios

    Router.route('/users', { where: 'server' })
        .get(function () {
            var response = User.find().fetch();
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        })

        // Rota do tipo post para salvar dados do usuari

        .post(function () {
            var response;
            if (this.request.body.userName === undefined || this.request.body.userPassword === undefined) {
                response = {
                    "error": true,
                    "message": "Dados invalidos"
                };
            } else {
                User.insert({
                    UserName: this.request.body.userName,
                    UserPassword: this.request.body.userPassword
                });
                response = {
                    "error": false,
                    "message": "Usuário adicionado com sucesso."
                }
            }
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        });

    //   Rota do tipo get feita para listar detalhes de apenas um usuário
    Router.route('/users/:id', { where: 'server' })

        .get(function () {
            var response;
            if (this.params.id !== undefined) {
                var data = User.find({ _id: this.params.id }).fetch();
                if (data.length > 0) {
                    response = data
                } else {
                    response = {
                        "error": true,
                        "message": "Usuário não encontrado."
                    }
                }
            }
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        })
        // Rota do tipo put para editar um usuário

        .put(function () {
            var response;
            if (this.params.id !== undefined) {
                var data = User.find({ _id: this.params.id }).fetch();
                if (data.length > 0) {
                    if (User.update({ _id: data[0]._id }, { $set: { UserName: this.request.body.userName, UserPassword: this.request.body.userPassword } }) === 1) {
                        response = {
                            "error": false,
                            "message": "Usuário atualizado."
                        }
                    } else {
                        response = {
                            "error": true,
                            "message": "Erro ao atualizar usuário."
                        }
                    }
                } else {
                    response = {
                        "error": true,
                        "message": "Usuário não encotrado."
                    }
                }
            }
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        })
        // Rota do tipo delete usada para deletar um usuário 
        .delete(function () {
            var response;
            if (this.params.id !== undefined) {
                var data = User.find({ _id: this.params.id }).fetch();
                if (data.length > 0) {
                    if (User.remove(data[0]._id) === 1) {
                        response = {
                            "error": false,
                            "message": "User deleted."
                        }
                    } else {
                        response = {
                            "error": true,
                            "message": "User not deleted."
                        }
                    }
                } else {
                    response = {
                        "error": true,
                        "message": "User not found."
                    }
                }
            }
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        });
}