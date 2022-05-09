let endpoint = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let data;
let values = [];
let yScale;
let xScale;
let convertedDates;
let yAxisScale;
let xAxisScale;
let xAxis;
let yAxis;
let tooltip;
let width = 800;
let height = 600;
let padding = 50;

let svg = d3.select('svg')

let drawCanvas = () =>{
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    yScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => {
            return item[1]
        })])
        .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding])

    convertedDates = values.map((item)=>{
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
        .domain([d3.min(convertedDates), d3.max(convertedDates)])
        .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item)=>{
            return item[1]
        })])
        .range([height-padding, padding])
}

// Place X and Y Axis on Chart
let generateAxes = () =>{

    // Create X and Y Axis
    xAxis = d3.axisBottom(xAxisScale)
    yAxis = d3.axisLeft(yAxisScale)

    // Add X-Axis to SVG
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)

    // Add Y-Axis to SVG
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
}

let drawBars = () =>{

    // Create Tooltips
    tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto')

    // Create Bar Chart
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length )
        .attr('data-date', (item)=>{
            return item[0]
        })
        .attr('data-gdp', (item)=>{
            return item[1]
        })
        .attr('height', (item)=>{
            return yScale(item[1])
        })
        .attr('x', (item, index)=>{
            return xScale(index)
        })
        .attr('y', (item)=>{
            return (height - padding) - yScale(item[1])
        })
        .on('mouseover', (event, item)=>{
            tooltip.transition()
                .style('visibility', 'visible')
            tooltip.text(`${item[0]} | $${item[1]}`)

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', (event, item)=>{
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}


fetch(endpoint)
    .then(response => response.json())
    .then((collected) =>{ 
        data = collected
        values = data.data
        drawCanvas()
        generateScales()
        drawBars()
        generateAxes()
    })

