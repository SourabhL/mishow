import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseAgreementComponent } from './release-agreement.component';

describe('ReleaseAgreementComponent', () => {
  let component: ReleaseAgreementComponent;
  let fixture: ComponentFixture<ReleaseAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
