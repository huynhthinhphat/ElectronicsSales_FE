import {
    ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexXAxis, ApexTooltip,
    ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexFill
} from 'ng-apexcharts';

export interface ChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke?: ApexStroke;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis?: ApexYAxis;
    tooltip?: ApexTooltip;
    colors?: string[];
    grid?: ApexGrid;
    title?: ApexTitleSubtitle;
    subtitle?: ApexTitleSubtitle;
    legency: ApexLegend
}
