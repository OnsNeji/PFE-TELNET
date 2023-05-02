import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Convention } from 'app/models/shared/convention.model';
import { ConventionService } from 'app/services/shared/convention.service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit,AfterViewInit {

  public totalConventions: number;
  conventionsPerMonth: any[];
  lastConvention: Convention;
  conventionDurations: any[];

  barChartData = [{ 
    data: [], 
    label: 'Conventions',
    backgroundColor: ['#1f77b4', '#aec7e8', '#778899', '#f0f8ff', '#87cefa', '#e6e6fa', '#4682b4', '#f8f8ff', '#778899', '#b0c4de','#f0ffff', '#f5f5f5'], // set different colors for each bar in the chart
    borderWidth: 1 // set border width for the bars }];
  }];
  barChartLabels: string[] = [];

  HbarChartData = [{ 
    data: [], 
    label: 'Durée de conventions',
    backgroundColor: ['#1f77b4', '#aec7e8', '#778899', '#b0c4de', '#87cefa', '#e6e6fa', '#4682b4', '#f8f8ff', '#778899', '#b0c4de','#f0ffff', '#f5f5f5'], // set different colors for each bar in the chart
    borderWidth: 1 // set border width for the bars }];
  }];
  HbarChartLabels: string[] = [];

  constructor(private conventionService: ConventionService) { }

  @ViewChild('chart') private chartRef!: ElementRef;
  private chart: any;
  @ViewChild('Hchart') private HchartRef!: ElementRef;
  private Hchart: any;

  ngOnInit(): void {
    this.conventionService.getTotalConventions().subscribe(data => {
      this.totalConventions = data
    });

    this.conventionService.getMonthlyStatistics().subscribe(data => {
      const countData = data.map(c => c.count);
      const monthLabels = data.map(c => c.month);

      this.barChartData[0].data.push(...countData);
      this.barChartLabels.push(...monthLabels);

      if (this.chart) {
        this.chart.update();
      }
    });

    this.conventionService.getLastConvention().subscribe((data) => {
      this.lastConvention = data
    });

    this.conventionService.getConventionDurations().subscribe(data => {
      const durationsData = data.map(x => x.duration);
      const conventionLabels = data.map(x => x.titre);
      console.log(durationsData)
    
      this.HbarChartData[0].data.push(...durationsData);
      this.HbarChartLabels.push(...conventionLabels);
    
      if (this.Hchart) {
        this.Hchart.update();
      }
    });
  }

  ngAfterViewInit() {
    const chartConfig: any = {
      type: 'bar',
      data: {
        labels: this.barChartLabels,
        datasets: this.barChartData,
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{ ticks: { 
            beginAtZero: true, } }],
          xAxes: [{ barThickness: 5 }],
        },
      },
      legend: {
        display: true,
      },
    };

    const HchartConfig: any = {
      type: 'bar',
      data: {
        labels: this.HbarChartLabels,
        datasets: this.HbarChartData,
      },
      options: {
        indexAxis:'y',
        responsive: true,
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }],
          xAxes: [{ barThickness: 5 }],
        },
      },
      legend: {
        display: true,
      },
    };

    
    this.Hchart = new Chart(this.HchartRef.nativeElement, HchartConfig);
    this.chart = new Chart(this.chartRef.nativeElement, chartConfig);
  }

}
