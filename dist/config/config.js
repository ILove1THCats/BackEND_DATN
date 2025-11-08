import dotenv from 'dotenv';
dotenv.config();
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || '',
        name: process.env.DB_NAME || 'mobiegis',
    },
    hashSaltRounds: Number(process.env.HASH_SALT_ROUNDS) || 10,
};
export default config;
//# sourceMappingURL=config.js.map