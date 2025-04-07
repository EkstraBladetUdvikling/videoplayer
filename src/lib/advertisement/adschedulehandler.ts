import type { IJwAdschedule, TAdScheduleOptions } from './types';

export async function getAdschedule(adScheduleOptions: TAdScheduleOptions): Promise<IJwAdschedule | undefined> {
  try {
    const { adscheduleId, adschedulePath } = adScheduleOptions;

    if (adscheduleId) {
      const scheduleUrl = `${adschedulePath}${adscheduleId}.json`;

      const scheduleResponse = await fetch(scheduleUrl, {
        headers: {},
        method: 'GET',
      });

      if (scheduleResponse.status >= 200 && scheduleResponse.status <= 299) {
        const scheduleJson = await scheduleResponse.json();

        return scheduleJson;
      } else {
        let errorLevel = 'ERROR';
        const deescalateResponses = ['Resource blocked by content blocker'];
        deescalateResponses.forEach((warnResponse) => {
          if (String(scheduleResponse).includes(warnResponse)) {
            errorLevel = 'WARN';
          }
        });
        (window as any).ebLog({
          component: 'JWPlayer',
          label: 'proxy fetch failed',
          level: errorLevel,
          message: `${scheduleUrl} errorResponse ${scheduleResponse}`,
        });

        throw new Error('Failed to fetch ad schedule');
      }
    } else {
      throw new Error('Failed to fetch ad schedule');
    }
  } catch (error) {
    window.ebLog({
      component: 'EBJW',
      label: 'getAdSchedule',
      level: 'ERROR',
      message: (error as Error).message,
    });
    return undefined;
  }
}
