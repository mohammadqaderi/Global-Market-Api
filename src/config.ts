// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Config {
  export const DbConfig = {
    type: 'postgres',
    host: 'localhost',
    password: 'password',
    port: 5432,
    database: 'database-name',
    username: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  };

  export const StripeConfig = {
    secretKey: 'secretKey',
    apiVersion: '2020-08-27'
  }

  export const AwsConfig = {
    AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
    ACCESS_KEY_ID: 'ACCESS_KEY_ID',
    SECRET_ACCESS_KEY: 'SECRET_ACCESS_KEY',
    cdnUrl: 'cdnUrl',
    region: 'us-east-2',
  };
  export const NodeMailerOptions = {
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        username: 'username',
        pass: 'pass',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  };
  export const VapidKeys = {
    publicKey: 'publicKey',
    privateKey: 'privateKey',
  };
  export const FrontEndKeys = {
    url: 'https://global-market-demo.herokuapp.com',
    endpoints: ['auth/reset-password', 'auth/verify-email'],
  };
}
