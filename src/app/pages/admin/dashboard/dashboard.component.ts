import { Component, OnInit } from '@angular/core';
import { ChartOptions } from '../../../models/ChartOptions.model';
import { DailySummary } from '../../../models/DailySummary.model';
import { StatisticService } from '../../../shared/services/StatisticServive/statistic.service';
import { Response as ApiResponse } from '../../../models/Response.model';
import { CustomList } from '../../../models/CustomList.model';
import { Product } from '../../../models/Product.model';
import { ProductChartData } from '../../../models/ProductChartData.model';
import { DailyRevenue } from '../../../models/DailyRevenue.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  chartOptionsOfBar?: Partial<ChartOptions>;
  chartOptionsOfArea?: Partial<ChartOptions>;

  constructor(
    private statisticService: StatisticService) {
  }

  dailySummary?: DailySummary;
  totalOrder: number = 0;
  totalPrice: number = 0;
  limitOfChartBar: number = 5;
  limitOfChartArea: number = 5;
  now: string = '';
  maxDate: string = '';
  endDateOfChartBar: string = '';
  endDateOfChartArea: string = '';
  startDateOfChartBar: string = '';
  startDateOfChartArea: string = '';

  ngOnInit() {
    this.getDate();
    this.getDailySummary();
    this.getTopProducts();
    this.getDailyRevenue();
  }

  setUpBar(chartData: ProductChartData[]) {
    const skus = chartData.map(p => p.sku);
    const data = chartData.map(p => p.quantity);

    this.chartOptionsOfBar = {
      series: [
        {
          name: "Số lượng đã bán",
          data: data
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '20%'
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        labels: {
          formatter: function (val: string) {
            const num = Number(val);
            if (isNaN(num)) return val;
            return num.toLocaleString('de-DE');
          }
        },
        categories: skus
      },
      colors: ['#4f39f6'],
      tooltip: {
        y: {
          formatter: (val: number) => val.toLocaleString('de-DE')
        },
        x: {
          formatter: (_: any, opts: any) => chartData[opts.dataPointIndex].fullName
        }
      },
    };
  }

  setUpArea(chartData: DailyRevenue[]) {
    const date = chartData.map(p => p.date);
    const data = chartData.map(p => p.totalPrice);

    this.chartOptionsOfArea = {
      series: [
        {
          name: "Doanh thu",
          data: data
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: date
      },
      colors: ['#4f39f6'],
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const value = series[seriesIndex][dataPointIndex];
          const totalOrder = chartData[dataPointIndex].totalOrder;
          const date = chartData[dataPointIndex].date;

          return `<div style="padding:5px;">
                    🧾 Tổng số đơn: ${totalOrder}<br>
                    💰 Doanh thu: ${value.toLocaleString('de-DE')} VNĐ
                  </div>`;
        }
      },
    };
  }

  getDailySummary() {
    this.statisticService.getDailySummary().subscribe({
      next: (res => {
        if (res) {
          this.dailySummary = res.data as DailySummary;
        }
      })
    })
  }

  getDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const date = `${year}-${month}-${day}`;

    this.now = date;
    this.maxDate = date;
    this.startDateOfChartBar = `${year}-01-01`;
    this.endDateOfChartBar = date;
    this.startDateOfChartArea = `${year}-01-01`;
    this.endDateOfChartArea = date;
  }

  filterChartBar() {
    this.getTopProducts();
  }

  getTopProducts() {
    this.statisticService.getTopProducts(this.limitOfChartBar, this.startDateOfChartBar, this.endDateOfChartBar).subscribe(
      ((res: ApiResponse<CustomList<Product>>) => {
        if (res) {
          let chartData: ProductChartData[] = [];
          for (const item of res.data.items) {
            chartData.push({
              sku: item.sku!,
              fullName: item.name!,
              quantity: item.quantitySold!
            });
          }
          this.setUpBar(chartData);
        }
      })
    )
  }

  filterChartArea() {
    this.getDailyRevenue();
  }

  getDailyRevenue() {
    this.statisticService.getDailyRevenue(this.limitOfChartArea, this.startDateOfChartArea, this.endDateOfChartArea).subscribe(
      ((res: ApiResponse<CustomList<DailyRevenue>>) => {
        if (res) {
          let chartData: DailyRevenue[] = [];

          for (const item of res.data.items) {
            this.totalOrder += item.totalOrder;
            this.totalPrice += item.totalPrice;

            chartData.push({
              date: item.date,
              totalOrder: item.totalOrder,
              totalPrice: item.totalPrice
            });
          }
          this.setUpArea(chartData);
        }
      })
    )
  }
}
