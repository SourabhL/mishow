import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDownloadPackComponent } from './view-download-pack.component';

describe('ViewDownloadPackComponent', () => {
  let component: ViewDownloadPackComponent;
  let fixture: ComponentFixture<ViewDownloadPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDownloadPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDownloadPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
