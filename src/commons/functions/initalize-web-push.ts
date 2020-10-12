import * as webPush from 'web-push';
import { Config } from '../../config';
import VapidKeys = Config.VapidKeys;
export function webPushInit() {
  webPush.setVapidDetails(
    'mailto:https://gobal-market-demo.herokuapp.com',
    VapidKeys.publicKey,
    VapidKeys.privateKey,
  );
}
