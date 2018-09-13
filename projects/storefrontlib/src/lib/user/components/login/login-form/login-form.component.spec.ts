import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromStore from '../../../store';
import * as fromRouting from '../../../../routing/store';
import * as fromAuthStore from '../../../../auth/store';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let store: Store<fromStore.UserState>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromStore.getReducers(),
          user: combineReducers(fromStore.getReducers()),
          auth: combineReducers(fromAuthStore.getReducers())
        })
      ],
      declarations: [LoginFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.returnValues(
      of(undefined),
      of({ access_token: 'test' }),
      of('/test')
    );

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form property', () => {
    expect(component.form.controls['userId'].value).toBe('');
    expect(component.form.controls['password'].value).toBe('');
  });

  it('should login', () => {
    component.form.controls['userId'].setValue('test@email.com');
    component.form.controls['password'].setValue('secret');
    component.login();

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromAuthStore.LoadUserToken({
        userId: 'test@email.com',
        password: 'secret'
      })
    );
  });

  it('should redirect to returnUrl saved in store if there is one', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      new fromRouting.Go({ path: ['/test'] })
    );
  });

  describe('userId form field', () => {
    const validEmails = [
      'email@example.com',
      'firstname.lastname@example.com',
      'email@subdomain.example.com',
      'firstname+lastname@example.com',
      'email@123.123.123.com',
      'email@[123.123.123.123]',
      '"email"@example.com',
      '1234567890@example.com',
      'email@example-one.com',
      '_______@example.com',
      'email@example.name',
      'email@example.museum',
      'email@example.co.jp',
      'firstname-lastname@example.com'
    ];
    const invalidEmails = [
      '',
      ' ',
      'plainaddress',
      ' startspace@example.com',
      'middle space@example.com',
      'endspace@example.com ',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      '.email@example.com',
      'email.@example.com',
      'email..email@example.com',
      'email@example.com (Joe Smith)',
      'email@example',
      'email@111.222.333.44444',
      'email@example..com',
      'Abc..123@example.com',
      '”(),:;<>[]@example.com',
      'this is"really"notallowed@example.com'
    ];

    function testValidEmail(email) {
      it(`should be valid when is '${email}'`, function() {
        const control = component.form.controls['userId'];

        control.setValue(email);
        expect(control.valid).toBeTruthy();
      });
    }

    function testInvalidEmail(email) {
      it(`should NOT be valid when is '${email}'`, function() {
        const control = component.form.controls['userId'];

        control.setValue(email);
        expect(control.valid).toBeFalsy();
      });
    }

    validEmails.forEach(testValidEmail);
    invalidEmails.forEach(testInvalidEmail);
  });

  describe('password form field', () => {
    it('should be valid when not empty', () => {
      const control = component.form.controls['password'];

      control.setValue('not-empty');
      expect(control.valid).toBeTruthy();

      control.setValue('not empty');
      expect(control.valid).toBeTruthy();

      control.setValue(' ');
      expect(control.valid).toBeTruthy();
    });

    it('should NOT be valid when empty', () => {
      const control = component.form.controls['password'];

      control.setValue('');
      expect(control.valid).toBeFalsy();

      control.setValue(null);
      expect(control.valid).toBeFalsy();
    });
  });
});
