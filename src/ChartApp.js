import React, { Component } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class ChartApp extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var chart = am4core.create("chartdiv", am4charts.PieChart);

        // Add data
        chart.data = this.props.datapoint;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.hidden = "hidden";
        // Let's cut a hole in our Pie chart the size of 40% the radius
        chart.innerRadius = am4core.percent(40);
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.text = this.props.percent + "%";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 20;

        // Disable ticks and labels
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // Disable tooltips
        // pieSeries.slices.template.tooltipText = "";
    }


    render() {
        return (
            <div id="chartdiv"></div>
        );
    }
}

export default ChartApp;