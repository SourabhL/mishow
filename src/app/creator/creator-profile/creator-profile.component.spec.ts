import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorProfileComponent } from './creator-profile.component';

describe('CreatorProfileComponent', () => {
  let component: CreatorProfileComponent;
  let fixture: ComponentFixture<CreatorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
