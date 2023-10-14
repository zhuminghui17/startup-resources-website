// Fetch the data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);
// Fetch data from the Flask backend and render the visualization

function fetchData() {
    fetch('http://127.0.0.1:5000/fetchData')
        .then(response => response.json())
        .then(data => {
            renderScatterPlot(data.records);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function renderScatterPlot(records) {
    const stages = ["Learning", "Fuzzy Idea", "Fuzzy Startup", "Defined Startup", "Startup Formed"];

    const margin = { top: 20, right: 20, bottom: 50, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(stages)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, records.length])
        .range([0, height]);

    const svgContainer = d3.select("#visualization").append("div");
    const svg = svgContainer.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("border", "1px solid black")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw columns for each stage
    svg.selectAll('rect')
        .data(stages)
        .enter().append('rect')
        .attr('x', d => xScale(d))
        .attr('y', 0)
        .attr('width', xScale.bandwidth())
        .attr('height', height)
        .attr('fill', '#f2f2f2');  // A light grey color for the columns

    // Index tracker for each stage
    let stageIndices = {};
    stages.forEach(s => stageIndices[s] = 0);

    records.forEach(record => {
        record.fields.Stage.forEach(stageName => {
            if (stages.includes(stageName)) {
                svg.append("circle")
                    .attr("cx", xScale(stageName) + xScale.bandwidth() / 2)
                    .attr("cy", yScale(stageIndices[stageName] * 10))
                    .attr("r", 5)
                    .attr("fill", () => {
                        switch (stageName) {
                            case "Learning": return "red";
                            case "Fuzzy Idea": return "blue";
                            case "Fuzzy Startup": return "green";
                            case "Defining Startup": return "yellow";
                            case "Startup Formed": return "purple";
                            default: return "black";
                        }
                    })
                    .on("click", () => {
                        alert(JSON.stringify(record.fields));
                    });
                stageIndices[stageName]++;
            }
        });
    });

    // Stage labels
    svg.selectAll(".stage-label")
        .data(stages)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
        .attr("y", height + 15)
        .attr("text-anchor", "middle")
        .attr("class", "stage-label") // to avoid selecting circles
        .text((d) => d);
}
