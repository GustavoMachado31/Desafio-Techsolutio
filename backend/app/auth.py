from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from .models import Usuario


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    #  Pega os dados do angular (e-mail e senha)
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    #  Login
    usuario = Usuario.query.filter_by(email=email).first()

   
    if usuario and check_password_hash(usuario.senha, senha):
        
        # (Token JWT) 
        token = create_access_token(identity=str(usuario.id))
        
        
        return jsonify({
            "mensagem": "Login realizado com sucesso!",
            "token": token
        }), 200

    # erro no login
    return jsonify({"erro": "E-mail ou senha inválidos"}), 401