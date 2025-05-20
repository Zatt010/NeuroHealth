// landingPage.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landingPage',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconModule],
  templateUrl: './landingPage.component.html',
  styleUrls: ['./landingPage.component.css'],
  providers: [DatePipe]
})
export class landingPage implements OnInit {
  selectedDate: Date | null = null;
  currentDate = new Date();
  calendarDays: (number | null)[][] = [];
  isLoggedIn: boolean = false;
  constructor(private router: Router, private datePipe: DatePipe, private authService: AuthService ) {}
  ngOnInit() {
    this.generateCalendar(this.currentDate);
    this.checkAuthStatus();
  }
  checkAuthStatus() {
    this.isLoggedIn = !!this.authService.getUsuario();

  }
  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.router.navigate(['/']).then(() => {
        window.location.reload(); // Recarga para actualizar el estado
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
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
    this.generateCalendar(this.currentDate);
  }
  confirmSelection(): void {
    if (this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      console.log('Fecha seleccionada:', formattedDate);
      this.router.navigate(['/appointments'], {
        queryParams: { date: formattedDate }
      });
    }
  }
}
