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

  @ViewChild('chart') private chartRef!: ElementRef;
  private chart: any;

  barChartData = [
    { 
      data: [], 
      label: 'Conventions',
      backgroundColor: ['#1f77b4', '#aec7e8', '#778899', '#f0f8ff', '#87cefa', '#e6e6fa', '#4682b4', '#f8f8ff', '#778899', '#b0c4de','#f0ffff', '#f5f5f5'], // set different colors for each bar in the chart
      borderWidth: 1 // set border width for the bars
    },
  ];
  barChartLabels: string[] = [];
  barChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
      xAxes: [{
        barThickness: 5
      }]
    }
  };
  barChartLegend = true;
  barChartType = 'bar';

  // @ViewChild('Hchart') private HchartRef!: ElementRef;
  // private Hchart: any;

  // HbarChartData = [
  //   {
  //     data: [],
  //     label: 'Durée des conventions (jours)',
  //     backgroundColor: '#1f77b4',
  //     borderWidth: 1,
  //   },
  // ];
  // HbarChartLabels: string[] = [];
  // HbarChartOptions = {
  //   responsive: true,
  //   scales: {
  //     xAxes: [{ ticks: { beginAtZero: true } }],
  //     yAxes: [
  //       {
  //         barThickness: 5,
  //       },
  //     ],
  //   },
  // };
  // HbarChartLegend = true;
  // ChartType = 'horizontalBar';


  constructor(private conventionService: ConventionService) { }
  
  ngAfterViewInit() {
    const chartConfig: any = {
      type: this.barChartType,
      data: {
        labels: this.barChartLabels,
        datasets: this.barChartData,
      },
      options: this.barChartOptions,
      legend: {
        display: this.barChartLegend,
      },
    };
    this.chart = new Chart(this.chartRef.nativeElement, chartConfig);

    // const HchartConfig: any = {
    //   type: this.ChartType,
    //   data: {
    //     labels: this.HbarChartLabels,
    //     datasets: this.HbarChartData,
    //   },
    //   options: this.HbarChartOptions,
    //   legend: {
    //     display: this.HbarChartLegend,
    //   },
    // };
    // this.Hchart = new Chart(this.HchartRef.nativeElement, HchartConfig);

  }

  

  ngOnInit(): void {

    this.conventionService.getTotalConventions().subscribe(total => {
      this.totalConventions = total;
    });

    this.conventionService.getMonthlyStatistics().subscribe(data => {
      this.conventionsPerMonth = data;
      const countData = this.conventionsPerMonth.map(c => c.count);
      const monthLabels = this.conventionsPerMonth.map(c => c.month);

      this.barChartData[0].data = countData;
      this.barChartLabels = monthLabels;

      if (this.chart) {
        this.chart.update();
      }
    });

    this.conventionService.getLastConvention().subscribe(
      (data: Convention) => {
        this.lastConvention = data;
      }
    );

    this.conventionService.getConventionDurations().subscribe((data: any) => {
      this.conventionDurations = data;
      // const durationData = data.map((c: any) => c.Duration);
      // const conventionLabels = data.map((c: any) => c.Titre);
  
      // this.HbarChartData[0].data = durationData;
      // this.HbarChartLabels = conventionLabels;
  
      // if (this.Hchart) {
      //   this.Hchart.update();
      // }
    });
  }

}
