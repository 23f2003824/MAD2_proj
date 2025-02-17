class Config():
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False


class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.sqlite3'
    SECURITY_PASSWORD_HASH = 'bcrypt' #mechanism to hash credentials before storing in database
    SECURITY_PASSWORD_SALT = 'thisshouldbekeptsecret'
    SECRET_KEY = 'shouldbekeptverysecret' #hash user credentials and store in session
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

    # cache specific
    CACHE_TYPE= "RedisCache"
    CACHE_DEFAULT_TIMEOUT= 30
    CACHE_REDIS_PORT= 6379
    


    WTF_CSRF_ENABLED = False # CSRF protection is disabled for development purposes
