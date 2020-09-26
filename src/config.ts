// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Config {
  export const DbConfig = {
    type: 'postgres',
    host: 'friday-market.clwaq40esgxk.us-east-2.rds.amazonaws.com',
    password: '633802asdASDasd',
    port: 5432,
    database: 'global-market',
    username: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  };

  export const AwsConfig = {
    AWS_S3_BUCKET_NAME: 'global-market-store',
    ACCESS_KEY_ID: 'AKIAJM6T2LPVYFHHY3VQ',
    SECRET_ACCESS_KEY: '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',
    cdnUrl: 'https://global-market-store.s3.us-east-2.amazonaws.com',
    region: 'us-east-2',
  };
  export const NodeMailerOptions = {
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        username: 'mqaderi44@gmail.com',
        pass: '633802asdASDasd',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  };
  export const VapidKeys = {
    publicKey: 'BKmeS0raBK4YrI7tiG3FaQ-TQJJjq-b4YsqxbiNgcTidYR3yvEkfLRFrFiljjAcXuNcVLErufWJ2pvhsN0O7uN8',
    privateKey: 'Psk8q_qyekL2hrPwnYF8k-ckTmb8JRmjBUBsmv9FquY',
  };
  export const FrontEndKeys = {
    url: 'localhost',
    port: 4200,
    endpoints: ['auth/reset-password', 'auth/verify-email'],
  };
}
