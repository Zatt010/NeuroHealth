// landingPage.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landingPage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landingPage.component.html',
  styleUrls: ['./landingPage.component.css']
})
export class landingPage implements OnInit {
  selectedDate: Date | null = null;
  currentDate = new Date();
  calendarDays: (number | null)[][] = [];

  ngOnInit() {
    this.generateCalendar(this.currentDate);
  }

  generateCalendar(date: Date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.calendarDays = [];
    let dateCount = 1;

    for (let i = 0; i < 6; i++) {
      const week: (number | null)[] = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay.getDay()) || dateCount > lastDay.getDate()) {
          week.push(null);
        } else {
          week.push(dateCount);
          dateCount++;
        }
      }
      this.calendarDays.push(week);
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
}
