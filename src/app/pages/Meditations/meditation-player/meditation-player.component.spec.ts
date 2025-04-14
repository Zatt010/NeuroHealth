import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeditationPlayerComponent } from './meditation-player.component';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

describe('MeditationPlayerComponent', () => {
  let component: MeditationPlayerComponent;
  let fixture: ComponentFixture<MeditationPlayerComponent>;

  const testMeditation = {
    id: 1,
    title: 'Test',
    type: 'audio',
    url: 'test.mp3'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MeditationPlayerComponent, // Importar componente standalone
        MatIconModule
      ],
      providers: [DomSanitizer]
    }).compileComponents();

    fixture = TestBed.createComponent(MeditationPlayerComponent);
    component = fixture.componentInstance;
    component.meditation = testMeditation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display audio element', () => {
    const mediaElement = fixture.debugElement.query(By.css('audio'));
    expect(mediaElement).toBeTruthy();
  });
});
