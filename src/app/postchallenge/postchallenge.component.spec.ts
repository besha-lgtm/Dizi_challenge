import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostchallengeComponent } from './postchallenge.component';

describe('PostchallengeComponent', () => {
  let component: PostchallengeComponent;
  let fixture: ComponentFixture<PostchallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostchallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostchallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
