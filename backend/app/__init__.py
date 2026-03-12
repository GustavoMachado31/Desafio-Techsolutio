from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from .config import Config
from .models import db, Usuario

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    # Tokens JWT
    jwt = JWTManager(app)
    
    # registro blueprints

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    from .routes import produtos_bp
    app.register_blueprint(produtos_bp)
    
    
    with app.app_context():
        db.create_all()
        
        # usuario teste:
        
        if not Usuario.query.first():
            senha_criptografada = generate_password_hash('123456')
            usuario_teste = Usuario(email='admin@teste.com', senha=senha_criptografada)
            db.session.add(usuario_teste)
            db.session.commit()
            print("✅ Usuário admin@teste.com criado com sucesso!")
            
    return app