import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSearchComponente } from './header-search.component';

describe('HeaderSearchComponente', () => {
  let component: HeaderSearchComponente;
  let fixture: ComponentFixture<HeaderSearchComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSearchComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSearchComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
