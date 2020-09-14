import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Config } from '../../../config';
import AwsConfig = Config.AwsConfig;
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { MailingData } from '../../../commons/interfaces/mailing-data.interface';
import * as nodeMailer from 'nodemailer';

AWS.config.update({
  accessKeyId: AwsConfig.ACCESS_KEY_ID,
  secretAccessKey: AwsConfig.SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

@Injectable()
export class EmailSenderService {

  constructor(private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>) {
  }

  async sendEmailMessage(data: MailingData) {
    const { from, text, html, subject, to } = data;
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mqaderi44@gmail.com',
        pass: 'zfflxrhqnncoebuh',
      },
      tls: {
        rejectUnauthorized: false,
      },
      port: 465,
      secure: true
    });
    const mailOptions = {
      from: 'mqaderi44@gmail.com',
      to,
      subject,
      text,
      html,
    };

    return transporter.sendMail(mailOptions);
    // await this.nodeMailerService.sendMail({
    //   from,
    //   to,
    //   subject,
    //   text,
    //   html,
    // }).then(info => {
    //   console.log('Message sent: %s', info.messageId);
    // }).catch(err => {
    //   console.log('Message sent: %s', err);
    // });
  }

  // sendEmail(from: string, to: string, subject: string, message: string) {
  //   const ses = new AWS.SES({ apiVersion: '2010-12-01' });
  //   const params = {
  //     Destination: {
  //       ToAddresses: [to],
  //     },
  //     Message: {
  //       Body: {
  //         Html: {
  //           Charset: 'UTF-8',
  //           Data: message,
  //         },
  //         Text: {
  //           Charset: 'UTF-8',
  //           Data: message,
  //         },
  //       },
  //       Subject: {
  //         Charset: 'UTF-8',
  //         Data: subject,
  //       },
  //     },
  //     Source: 'mqaderi44@gmail.com',
  //   };
  //
  //   ses.sendEmail(params, (err, data) => {
  //     if (err) {
  //       return console.log(err, err.stack);
  //     } else {
  //       console.log('Email sent.', data);
  //     }
  //   }).promise().then(() => {
  //     console.log('hey');
  //   });
  // };
}
