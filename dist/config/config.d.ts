interface Config {
    port: number;
    nodeEnv: string;
    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
    };
    hashSaltRounds: number;
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map