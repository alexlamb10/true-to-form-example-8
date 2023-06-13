import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public form = this._fb.group(
    {
      password: ['test', [Validators.required]],
      confirmPassword: ['test', [Validators.required]],
      tags: this._fb.array([], [this.minArrayLength(2)]),
    },
    { validators: [this.passwordsEqual('password', 'confirmPassword')] }
  );

  public formUpdates$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    map((formValues) => {
      return { ...formValues, valid: this.form.valid };
    })
  );

  minArrayLength(num: number): ValidatorFn {
    return (array: FormArray): ValidationErrors | null => {
      const length = array.controls.length;
      return length >= num
        ? null
        : { minArrayLength: { actual: length, expected: num } };
    };
  }

  passwordsEqual(control1Name: string, control2Name: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const val1 = group.value[control1Name];
      const val2 = group.value[control2Name];

      const valsEqual = val1 === val2;

      if (!valsEqual) {
        group.controls[control2Name]?.setErrors({ passwordsEqual: true });
      }

      return val1 === val2 ? null : { passwordsEqual: true };
    };
  }

  constructor(private _fb: FormBuilder) {}
}
