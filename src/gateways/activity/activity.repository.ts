import { EntityRepository, Repository } from 'typeorm';
import { Activity } from './activity.entity';

@EntityRepository(Activity)
export class ActivityRepository extends Repository<Activity> {

  async getActivities(take: number, skip: number) {
    const query = this.createQueryBuilder('activity').select();
    if (skip) {
      query.skip(skip);
    }
    if (take) {
      query.limit(take);
    }
    const activities = await query.getMany();
    return activities;
  }
}
