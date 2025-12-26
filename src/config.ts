// Configuration file for testing PR reviewer imports
export interface AppConfig {
    port: number;
    environment: string;
    apiVersion: string;
}

export const defaultConfig: AppConfig = {
    port: 3000,
    environment: process.env.NODE_ENV || 'development',
    apiVersion: 'v1',
};

export function getConfig(): AppConfig {
    return {
        ...defaultConfig,
        port: Number(process.env.PORT) || defaultConfig.port,
    };
}

