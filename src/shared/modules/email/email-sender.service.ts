import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Config } from '../../../config';
import AwsConfig = Config.AwsConfig;
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { MailingData } from '../../../commons/interfaces/mailing-data.interface';
import * as nodeMailer from 'nodemailer';
import { ContactMessageDto } from '../../dto/contact-message.dto';

AWS.config.update({
  accessKeyId: AwsConfig.ACCESS_KEY_ID,
  secretAccessKey: AwsConfig.SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

@Injectable()
export class EmailSenderService {
  transporter;

  constructor(private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>) {
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mqaderi44@gmail.com',
        pass: 'zfflxrhqnncoebuh',
      },
      tls: {
        rejectUnauthorized: false,
      },
      port: 465,
      secure: true,
    });
  }

  async sendEmailMessage(data: MailingData) {
    const {text, html, subject, to } = data;
    const mailOptions = {
      from: 'mqaderi44@gmail.com',
      to,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendContactMessage(payload: ContactMessageDto) {
    const { email, message, subject } = payload;
    const mailOptions = {
      from: email,
      to: 'mqaderi44@gmail.com',
      subject,
      text: message,
    };
    return this.transporter.sendMail(mailOptions);
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
