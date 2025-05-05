// emotion-tracker.component.ts
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  imports: [NgChartsModule,RouterModule,CommonModule,FormsModule], 
  templateUrl: './emotion-tracker.component.html',
  styleUrls: ['./emotion-tracker.component.css']
})
export class EmotionTrackerComponent implements OnInit {
  emotions: any[] = [];
  selectedEmotion: string = '';
  comment: string = '';

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  ngOnInit() {
    this.loadEmotions();
    this.updateChart();
  }

  loadEmotions() {
    const saved = localStorage.getItem('emotions');
    this.emotions = saved ? JSON.parse(saved) : [];
  }

  saveEmotion() {
    if (!this.selectedEmotion) return;

    const newEntry = {
      date: new Date().toISOString(),
      emotion: this.selectedEmotion,
      comment: this.comment
    };

    this.emotions.push(newEntry);
    localStorage.setItem('emotions', JSON.stringify(this.emotions));
    
    this.selectedEmotion = '';
    this.comment = '';
    this.updateChart();
  }

  private updateChart() {
    const emotionCount = this.emotions.reduce((acc, entry) => {
      const day = new Date(entry.date).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    this.barChartData.datasets = [{
      data: Array(7).fill(0).map((_, i) => emotionCount[i] || 0),
      label: 'Emociones registradas',
      backgroundColor: '#5A92C277',
      borderColor: '#2A4E6E',
      borderWidth: 1
    }];
  }
}