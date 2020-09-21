import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAgreementComponent } from './partner-agreement.component';

describe('PartnerAgreementComponent', () => {
  let component: PartnerAgreementComponent;
  let fixture: ComponentFixture<PartnerAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
