import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenUri'
})
export class ShortenUriPipe implements PipeTransform {

  transform(value: string, delimiter = '/'): string {
    let tmp = value.split(delimiter);
    return tmp[tmp.length - 1];
  }

}
