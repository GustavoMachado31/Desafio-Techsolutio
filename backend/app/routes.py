import json
import redis
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .models import Produto
from .config import Config

# (Redis)
fila_redis = redis.from_url(Config.REDIS_URL)

produtos_bp = Blueprint('produtos', __name__, url_prefix='/products')

#  LÊ DIRETO DO BANCO 
@produtos_bp.route('', methods=['GET'])
@jwt_required() # <---  (Token)
def listar_produtos():
    produtos = Produto.query.order_by(Produto.id).all()
    resultado = []
    for p in produtos:
        resultado.append({
            "id": p.id,
            "nome": p.nome,
            "marca": p.marca,
            "valor": p.valor,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None
        })
    return jsonify(resultado), 200

# POST, PUT E DELETE VÃO PARA A FILA ---

@produtos_bp.route('', methods=['POST'])
@jwt_required()
def criar_produto():
    dados = request.get_json()
    
   
    mensagem = {
        "operacao": "create",
        "dados": {
            "nome": dados.get("nome"),
            "marca": dados.get("marca"),
            "valor": dados.get("valor")
        }
    }
    
    
    fila_redis.lpush('fila_produtos', json.dumps(mensagem))
    
    
    return jsonify({"mensagem": "Operação de criação enfileirada com sucesso!"}), 202

@produtos_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_produto(id):
    dados = request.get_json()
    mensagem = {
        "operacao": "update",
        "dados": {
            "id": id,
            "nome": dados.get("nome"),
            "marca": dados.get("marca"),
            "valor": dados.get("valor")
        }
    }
    fila_redis.lpush('fila_produtos', json.dumps(mensagem))
    return jsonify({"mensagem": "Operação de atualização enfileirada com sucesso!"}), 202

@produtos_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_produto(id):
    mensagem = {
        "operacao": "delete",
        "dados": {"id": id}
    }
    fila_redis.lpush('fila_produtos', json.dumps(mensagem))
    return jsonify({"mensagem": "Operação de exclusão enfileirada com sucesso!"}), 202