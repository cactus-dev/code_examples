import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';

export const DATE_PICKER: IMyDpOptions = {
  dateFormat: 'mmm dd yyyy',
  alignSelectorRight: true,
  showClearDateBtn: false,
  height: '28px',
  disableSince: { year: moment().year(),
                  month: moment().month() + 1,
                  day: moment().date() + 1 }
}


