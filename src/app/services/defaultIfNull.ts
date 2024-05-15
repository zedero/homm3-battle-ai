import { Pipe, PipeTransform } from '@angular/core';

/*
 * Returns the value or a default value
 */
@Pipe({ name: 'defaultIfNull', standalone: true })
export class DefaultIfNullPipe implements PipeTransform {
  transform<ValueType, DefaultValueType>(value: ValueType, defaultValue: DefaultValueType): NonNullable<ValueType> | DefaultValueType {
    if (value === null) {
      return defaultValue;
    }
    return value as NonNullable<ValueType>;
  }
}
