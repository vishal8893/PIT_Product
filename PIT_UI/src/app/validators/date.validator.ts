import {FormControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {

    static ValidateDate(control: FormControl) {
        if (!moment(control.value, 'DD/MM/YYYY', true).isValid()){
            return {invaliDate: true };
        }

        return {invaliDate: false };
    }
}