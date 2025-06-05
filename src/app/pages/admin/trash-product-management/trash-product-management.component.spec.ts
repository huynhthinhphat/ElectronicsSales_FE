import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashProductManagementComponent } from './trash-product-management.component';

describe('TrashProductManagementComponent', () => {
  let component: TrashProductManagementComponent;
  let fixture: ComponentFixture<TrashProductManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashProductManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
