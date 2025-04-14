import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeditationsComponent } from './meditations.component';
import { MeditationsService, Meditation } from './meditations.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MeditationsComponent', () => {
  let component: MeditationsComponent;
  let fixture: ComponentFixture<MeditationsComponent>;
  let mockService: jasmine.SpyObj<MeditationsService>;

  const mockData: Meditation[] = [{
    id: 1,
    title: 'Meditación Zen',
    description: 'Relajación profunda',
    duration: '15 mins',
    type: 'audio',
    url: 'assets/zen.mp3'
  }];

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj<MeditationsService>(
      'MeditationsService',
      ['getMeditations']
    );
    mockService.getMeditations.and.returnValue(of(mockData));

    TestBed.configureTestingModule({
      imports: [
        MeditationsComponent, // Componente standalone
        MatCardModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: MeditationsService, useValue: mockService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeditationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display meditation cards', async () => {
    await fixture.whenStable();

    const cards = fixture.debugElement.queryAll(By.css('.meditation-card'));
    expect(cards.length).toBe(1);

    const titleElement = cards[0].query(By.css('mat-card-title'));
    expect(titleElement.nativeElement.textContent).toContain('Meditación Zen');
  });

  it('should handle play meditation', async () => {
    const playButton = fixture.debugElement.query(By.css('button'));
    playButton.nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.playerVisible).toBeTrue();
    expect(component.selectedMeditation?.id).toBe(1);
  });
});
