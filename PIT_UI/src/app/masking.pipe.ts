import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masking'
})
export class MaskingPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    // Assuming the phone number is in the format "8806509191"
    const formattedNumber = '******' + value.slice(-4);

    return formattedNumber;
  }

}
