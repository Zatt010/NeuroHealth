// landingPage.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { EspecialistaService } from '../../services/especialista.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landingPage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landingPage.component.html',
  styleUrls: ['./landingPage.component.css'],
  providers: [DatePipe]
})
export class landingPage implements OnInit, AfterViewInit, OnDestroy {
  selectedDate: Date | null = null;
  currentDate = new Date();
  calendarDays: (number | null)[][] = [];
  isLoggedIn: boolean = false;
  isEspecialista: boolean = false;

  private fragmentSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private authService: AuthService,
    private especialistaService: EspecialistaService,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.generateCalendar(this.currentDate);
    this.checkAuthStatus();
  }

  ngAfterViewInit(): void {
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToFragment(fragment), 100);
      }
    });
  }

  scrollToFragment(fragment: string): void {
    try {
      const element = document.querySelector(`#${fragment}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      console.error('LandingPage: Error scrolling to fragment:', e);
    }
  }

  checkAuthStatus() {
    const usuario = this.authService.getUsuario();
    this.isLoggedIn = !!usuario;
    this.isEspecialista = usuario?.rol === 'especialista';
  }

  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.isEspecialista = false; // Asegúrate de resetear esto también
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }

  generateCalendar(date: Date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    this.calendarDays = [];
    let days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
      if (days.length === 7) {
        this.calendarDays.push(days);
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(null);
      }
      this.calendarDays.push(days);
    }
  }

  selectDate(day: number | null) {
    if (day) {
      this.selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
    }
  }

  isSelected(day: number | null): boolean {
    return !!day && !!this.selectedDate &&
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear();
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1
    );
    this.generateCalendar(this.currentDate);
    this.selectedDate = null; // Resetea la fecha seleccionada al cambiar de mes
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
    this.generateCalendar(this.currentDate);
    this.selectedDate = null; // Resetea la fecha seleccionada al cambiar de mes
  }

  confirmSelection(): void {
    if (this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.router.navigate(['/appointments'], {
        queryParams: { date: formattedDate }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
  }
}