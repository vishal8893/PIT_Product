import { FormControl } from '@angular/forms' ;

export function IpValidator(control: FormControl) {
    if(control.value && control.value.trim() != ''){
        return /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(control.value)
    ? null: {'ip': true};
    }
    else {
        return null;
    }
}