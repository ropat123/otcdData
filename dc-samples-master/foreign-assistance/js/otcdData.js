var billion = 1000000000;

var appropriationTypeColors =
    ["#9ecae1", // light blue 
    "#74C365",  // light green 
    "#007BA7"]; // blue

var temp=0.0;

var metabolite="gpcLevel";

d3.csv("data/practiceData.csv", function (data) {
    data.forEach(function (d) {
        d.amount = +d.amount; // cast to numbers
    });
    // put data in crossfilter
    var facts = crossfilter(data);

    // 01 group for grand total 
    var totalGroup = facts.groupAll().reduce(
        function (p, v) { // add function
            return p += v.amount;
        },
        function (p, v) { // subtract function
            return p -= v.amount;
        },
        function () { return 0 } // initial function
    );
    // or you could use this convenience function: 
     var totalGroup = facts.groupAll().reduceSum(dc.pluck("one"));


    // 02 display grand total
    dc.numberDisplay("#dc-chart-total")
        .group(totalGroup)
        .valueAccessor(function (d) {
        	temp=d;
            return d;
        })
        .formatNumber(function (d) { return Math.round(d); });

    // 03 dimension, group and pie chart for appropriation type
    var patientTypeDim = facts.dimension(dc.pluck('patientType'));
    var patientTypeGroupSum =
        patientTypeDim.group().reduceSum(dc.pluck("one"));
    
    //Pie Chart of Patient Types
    dc.pieChart("#dc-chart-patientType")
    .dimension(patientTypeDim)
    .group(patientTypeGroupSum)
    .width(200)
    .height(200)
    .radius(80)
    .ordinalColors(appropriationTypeColors);
 
    //Scatter Plot
    var otherTypeDim = facts.dimension(dc.pluck('gpcLevel'));
    var otherTypeGroupSum =
        otherTypeDim.group().reduceSum(dc.pluck("age"));
    var otherTypeGroup = otherTypeDim.group();
    
    var chart = dc.scatterPlot("#dc-chart-appropriationType");{
      chart
        .width(900)
        .height(340)
        .y(d3.scale.linear().domain([0,60]))
        .x(d3.scale.linear().domain([0.5,1.5]))
//        .elasticX(true)
//        .elasticY(true)
//        .brushOn(true)
        .xAxisLabel("GPC Level")
        .yAxisLabel("Age")
        .dimension(otherTypeDim)
        .group(otherTypeGroupSum);
    };

//    // 05 stacked bar chart for fiscal year w/appropriation types  
//    var bar = dc.barChart("#dc-chart-fiscalYear")
//        .dimension(fiscalYearDim)
//        .group(fiscalYearGroupSum, "Big").valueAccessor(function (d) { return d.value.Big; })
//        .width(800)
//        .height(100).margins({ top: 10, right: 30, bottom: 20, left: 50 })
//        .legend(dc.legend().x(60).y(20))
//        .gap(500)  // space between bars
//        .centerBar(true)
//        .filter([3.5, 8.5])
//        .x(d3.scale.linear().domain([3.5, 8.5]))
//        .elasticY(true)
//        .ordinalColors(appropriationTypeColors);

//    // 06 Set format. These don't return the chart, so can't chain them 
//    bar.xAxis().tickFormat(d3.format("d")); // need "2005" not "2,005" 
//    bar.yAxis().tickFormat(function (v) { return v; });
//
    // 08 make row charts
    new RowChart(facts, "gpcLevel", 300, 100);
    new RowChart(facts, "naaLevel", 300, 10);
    new RowChart(facts, "glutamylLevel", 300, 10);
    new RowChart(facts, "glutamineLevel", 300, 50);
    new RowChart(facts, "myoInositolLevel", 300, 50);
    new RowChart(facts, "glutamateLevel",300,50);
    new RowChart(facts, "creatineLevel",300,50);
    new RowChart(facts, "naacreatineRatio",300,50);
    new RowChart(facts, "micrRatio",300,50);
    
    
//    // Display median
//    this.dim = facts.dimension(dc.pluck("creatineLevel"));
////    
////    // or you could use this convenience function: 
//    var med = facts.group().top(2);
//    dc.numberDisplay("#dc-chart-median")
//        .group(med)
//        .valueAccessor(function (d) {
//        	var x=median(d);
//        	return x;
//        })
//        .formatNumber(function (d) { return d; });
    
    // draw all dc charts. w/o this nothing happens!  
    dc.renderAll();
});

// 07 constructor function for row charts
var RowChart = function (facts, attribute, width, maxItems) {
    this.dim = facts.dimension(dc.pluck(attribute));
  
    // or you could use this convenience function: 
    var totalGroup = facts.groupAll().reduceSum(dc.pluck(attribute));
    // 02 display grand total
    dc.numberDisplay("#dc-chart-" + attribute)
        .group(totalGroup)
        .valueAccessor(function (d) {
            return d/temp;
        })
        .formatNumber(function (d) { return d.toFixed(3); });
    

};

//function median(numbers) {
//    var median = 0,
//        numsLen = numbers.length;
//    numbers.sort();
//    if (numsLen % 2 === 0) { // is even
//        // average of two middle numbers
//        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
//    } else { // is odd
//        // middle number only
//        median = numbers[(numsLen - 1) / 2];
//    }
//    return median;
//}
