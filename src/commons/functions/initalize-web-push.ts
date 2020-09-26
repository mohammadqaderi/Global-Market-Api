import * as webPush from 'web-push';
import { Config } from '../../config';
import VapidKeys = Config.VapidKeys;
export function webPushInit() {
  webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    VapidKeys.publicKey,
    VapidKeys.privateKey,
  );
}
