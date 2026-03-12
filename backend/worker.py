import json
import redis
import time
from app import create_app
from app.models import db, Produto
from app.config import Config

# 1. Ligamos o motor do Flask só para ter acesso ao Banco de Dados
app = create_app()
app.app_context().push()

# 2. Conectamos no nosso preguinho de comandas (Redis)
fila_redis = redis.from_url(Config.REDIS_URL)

print("👷 Chapeiro (Worker) na área! Olhando para a 'fila_produtos'...")

while True:
    try:
        # 3. O worker fica travado aqui esperando chegar uma comanda.
        # O brpop pega a última mensagem e apaga ela da fila.
        mensagem_crua = fila_redis.brpop('fila_produtos', timeout=0)
        
        if mensagem_crua:
            # O Redis devolve uma tupla (nome_da_fila, dados), pegamos só os dados
            _, dados_json = mensagem_crua
            mensagem = json.loads(dados_json)
            
            operacao = mensagem.get('operacao')
            dados = mensagem.get('dados')
            
            # 4. Executando as operações no Banco de Dados
            if operacao == 'create':
                novo_produto = Produto(nome=dados['nome'], marca=dados['marca'], valor=dados['valor'])
                db.session.add(novo_produto)
                db.session.commit()
                print(f"✅ [CREATE] Produto '{dados['nome']}' salvo no banco!")
                
            elif operacao == 'update':
                produto = Produto.query.get(dados['id'])
                if produto:
                    produto.nome = dados['nome']
                    produto.marca = dados['marca']
                    produto.valor = dados['valor']
                    db.session.commit()
                    print(f"✅ [UPDATE] Produto ID {dados['id']} atualizado!")
                    
            elif operacao == 'delete':
                produto = Produto.query.get(dados['id'])
                if produto:
                    db.session.delete(produto)
                    db.session.commit()
                    print(f"✅ [DELETE] Produto ID {dados['id']} apagado do banco!")
                    
    except Exception as e:
        # Se der erro (ex: banco caiu), desfazemos a operação e logamos o erro
        db.session.rollback()
        print(f"❌ [ERRO] Falha {e}")
        time.sleep(5) # Pausa de 5 segundos antes de tentar de novo