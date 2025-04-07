import { PLACEMENTGROUPNAMES } from 'frontend/js-admanager/src';

/* Get adScheduleId for Play */
export const getAdScheduleId = (
  placementgroup: PLACEMENTGROUPNAMES,
  isSmartphone: boolean,
  isPlayVideo: boolean,
  isDiscovery: boolean,
  isCtp: boolean
) => {
  if (isPlayVideo) {
    switch (placementgroup) {
      case PLACEMENTGROUPNAMES.underholdning:
        return isSmartphone ? { adscheduleId: 'MPVAd5l6' } : { adscheduleId: 'soc1UkfG' };

      case PLACEMENTGROUPNAMES.krimi:
        return isSmartphone ? { adscheduleId: 'dr4xy1K9' } : { adscheduleId: 'iJu5KvIF' };

      case PLACEMENTGROUPNAMES.kup:
        return isSmartphone ? { adscheduleId: 'D2Kvkngq' } : { adscheduleId: '1yDQ2hnG' };

      case PLACEMENTGROUPNAMES.nyheder:
        return isSmartphone ? { adscheduleId: 'LfOkf7zu' } : { adscheduleId: 'gUhrMx4j' };

      case PLACEMENTGROUPNAMES.sport:
        return isSmartphone ? { adscheduleId: '0ECu1oJr' } : { adscheduleId: 'zqTQt5RR' };

      case PLACEMENTGROUPNAMES.penge:
        return isSmartphone ? { adscheduleId: 'QWv2iCGm' } : { adscheduleId: 'UH88h0Vg' };

      case PLACEMENTGROUPNAMES.test:
        return isSmartphone ? { adscheduleId: 'pcED95yl' } : { adscheduleId: 'nsnTFut9' };

      case PLACEMENTGROUPNAMES.noconsent:
        return isSmartphone ? { adscheduleId: 'hfni78wj' } : { adscheduleId: 'QjASA7Tw' };

      case PLACEMENTGROUPNAMES.ros:
      default:
        return isSmartphone ? { adscheduleId: 'EWhnQku3' } : { adscheduleId: 'Lx6HEoHd' };
    }
  } else if (isCtp) {
    switch (placementgroup) {
      case PLACEMENTGROUPNAMES.underholdning:
        return isSmartphone ? { adscheduleId: 'Ie8WXARL' } : { adscheduleId: 'Ew52PaHq' };

      case PLACEMENTGROUPNAMES.krimi:
        return isSmartphone ? { adscheduleId: 'scHWoPgI' } : { adscheduleId: 'zVbGkycA' };

      case PLACEMENTGROUPNAMES.kup:
        return isSmartphone ? { adscheduleId: 'IbdrAun8' } : { adscheduleId: 'D2Kvkngq' };

      case PLACEMENTGROUPNAMES.nyheder:
        return isSmartphone ? { adscheduleId: 'Fcwl6KKJ' } : { adscheduleId: 'oWdZ40Jd' };

      case PLACEMENTGROUPNAMES.sport:
        return isSmartphone ? { adscheduleId: 'JUDc0HzK' } : { adscheduleId: 'V3G00tFj' };

      case PLACEMENTGROUPNAMES.penge:
        return isSmartphone ? { adscheduleId: 'i9QOoGRx' } : { adscheduleId: 'mQd2feFH' };

      case PLACEMENTGROUPNAMES.test:
        return isSmartphone ? { adscheduleId: 'pcED95yl' } : { adscheduleId: 'nsnTFut9' };

      case PLACEMENTGROUPNAMES.noconsent:
        return isSmartphone ? { adscheduleId: 'jVgpM18d' } : { adscheduleId: 'AJeSwGV1' };

      case PLACEMENTGROUPNAMES.ros:
      default:
        return isSmartphone ? { adscheduleId: 'W6wFiIVD' } : { adscheduleId: 'oj7fxGCE' };
    }
  } else if (isDiscovery) {
    switch (placementgroup) {
      case PLACEMENTGROUPNAMES.underholdning:
        return isSmartphone ? { adscheduleId: 'yYcmpgW1' } : { adscheduleId: 'MOwRwQMd' };

      case PLACEMENTGROUPNAMES.noconsent:
        return isSmartphone ? { adscheduleId: 'JMrsp4UT' } : { adscheduleId: 'yhIgDX6p' };

      case PLACEMENTGROUPNAMES.sport:
      default:
        return isSmartphone ? { adscheduleId: 'qlqQvhPz' } : { adscheduleId: 'CABgBiWH' };
    }
  } else {
    switch (placementgroup) {
      case PLACEMENTGROUPNAMES.underholdning:
        return isSmartphone ? { adscheduleId: 'kE9I7Vbl' } : { adscheduleId: 'xR5WLQtG' };

      case PLACEMENTGROUPNAMES.krimi:
        return isSmartphone ? { adscheduleId: 'iERayknr' } : { adscheduleId: 'xDCLY1QI' };

      case PLACEMENTGROUPNAMES.kup:
        return isSmartphone ? { adscheduleId: 'Cj791moS' } : { adscheduleId: 'DjjwylT8' };

      case PLACEMENTGROUPNAMES.nyheder:
        return isSmartphone ? { adscheduleId: 'NnHIeYZS' } : { adscheduleId: 'KVebX90h' };

      case PLACEMENTGROUPNAMES.sport:
        return isSmartphone ? { adscheduleId: 'yztX6gIS' } : { adscheduleId: 'UaaHxsej' };

      case PLACEMENTGROUPNAMES.penge:
        return isSmartphone ? { adscheduleId: 'R0Ifm7Ov' } : { adscheduleId: 'a9lJmm4O' };

      case PLACEMENTGROUPNAMES.test:
        return isSmartphone ? { adscheduleId: 'QtAh2ANg' } : { adscheduleId: 'j5j4hlYZ' };

      case PLACEMENTGROUPNAMES.noconsent:
        return isSmartphone ? { adscheduleId: 'JMrsp4UT' } : { adscheduleId: 'yhIgDX6p' };

      case PLACEMENTGROUPNAMES.ros:
      default:
        return isSmartphone ? { adscheduleId: 'tTaDq0ht' } : { adscheduleId: 'nCCsFt8l' };
    }
  }
};
