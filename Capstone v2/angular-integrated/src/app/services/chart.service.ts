import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() {
    Chart.register(...registerables);
  }

  createChart(canvasId: string, config: ChartConfiguration): Chart {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas) {
      return new Chart(canvas, config);
    }
    throw new Error(`Canvas with id ${canvasId} not found`);
  }

  getLineChartConfig(labels: string[], data: number[], label: string): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };
  }

  getPieChartConfig(labels: string[], data: number[]): ChartConfiguration {
    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    };
  }

  getBarChartConfig(labels: string[], data: number[], label: string): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };
  }
}