import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionSettingComponent } from './subcription-setting.component';

describe('SubcriptionSettingComponent', () => {
  let component: SubcriptionSettingComponent;
  let fixture: ComponentFixture<SubcriptionSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcriptionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcriptionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
