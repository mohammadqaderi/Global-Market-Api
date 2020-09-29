import { EntityRepository, Repository } from 'typeorm';
import { Activity } from './activity.entity';

@EntityRepository(Activity)
export class ActivityRepository extends Repository<Activity> {

  async getActivities(take: number, skip: number) {
    const query = this.createQueryBuilder('activity').select();
    const activities = await query.orderBy({
      'activity.time': 'DESC',
    }).take(take).getMany();
    return activities;
  }
}
