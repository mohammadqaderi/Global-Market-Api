import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Activity } from './activity.entity';
import { ActivityDto } from './dto/activity.dto';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { ActivityRepository } from './activity.repository';


@WebSocketGateway()
export class ActivityGateway {

  constructor(
    private readonly activityRepository: ActivityRepository) {
  }

  @WebSocketServer() server;


  @SubscribeMessage('push-new-activity')
  async pushNewActivity(client: Socket, data: { activityDto: ActivityDto }) {
    const { action, description, user } = data.activityDto;
    const activity = new Activity();
    activity.user = user;
    activity.description = description;
    activity.action = action;
    activity.time = new Date(Date.now());
    const newActivity = await activity.save();
    client.server.emit('activity', newActivity);
  }

  @SubscribeMessage('remove-activity')
  async removeActivity(client: Socket, data: { activityId: number }) {
    const { activityId } = data;
    const result = await this.activityRepository.delete(activityId);
    if (result.affected === 0) {
      NotFound('Activity', activityId);
    }
    client.server.emit('delete-activity', activityId);
  }

  async getActivityById(id: number) {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
      },
    });
    if (!activity) {
      NotFound('Activity', id);
    }
    return activity;
  }

}
