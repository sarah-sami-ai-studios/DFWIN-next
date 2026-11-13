/**
 * DFWin Supply Chain Visualizations
 * Uses D3.js to render an interactive network graph showing DFWin at the center of the supply chain.
 */

document.addEventListener("DOMContentLoaded", () => {
    initSupplyChainViz();
});

function initSupplyChainViz() {
    const container = document.getElementById('supply-chain-viz');
    if (!container) return;

    // Data for the network graph
    const data = {
        nodes: [
            { id: "Client Operations", group: "client", radius: 35, label: "Your Operations" },
            { id: "DFWin", group: "hub", radius: 50, label: "DFWin Team" },
            { id: "Tier 1 Factory", group: "supplier", radius: 25, label: "Tier 1 Factory" },
            { id: "Tier 2 Factory", group: "supplier", radius: 20, label: "Component Maker" },
            { id: "Raw Materials", group: "supplier", radius: 15, label: "Raw Materials" },
            { id: "QA/QC", group: "quality", radius: 30, label: "Inline QA/QC" },
            { id: "Warehouse", group: "logistics", radius: 30, label: "Bonded Warehouse" },
            { id: "Ocean Freight", group: "logistics", radius: 25, label: "Ocean Transit" },
            { id: "Air Freight", group: "logistics", radius: 25, label: "Air Expedite" }
        ],
        links: [
            { source: "Client Operations", target: "DFWin", value: 4 },
            { source: "DFWin", target: "Tier 1 Factory", value: 3 },
            { source: "DFWin", target: "Tier 2 Factory", value: 2 },
            { source: "Tier 1 Factory", target: "Raw Materials", value: 1 },
            { source: "Tier 2 Factory", target: "Raw Materials", value: 1 },
            { source: "DFWin", target: "QA/QC", value: 3 },
            { source: "Tier 1 Factory", target: "QA/QC", value: 2 },
            { source: "Tier 2 Factory", target: "QA/QC", value: 2 },
            { source: "DFWin", target: "Warehouse", value: 4 },
            { source: "Warehouse", target: "Ocean Freight", value: 2 },
            { source: "Warehouse", target: "Air Freight", value: 2 },
            { source: "Tier 1 Factory", target: "Ocean Freight", value: 2 },
            { source: "Tier 2 Factory", target: "Air Freight", value: 2 },
            { source: "Ocean Freight", target: "Client Operations", value: 3 },
            { source: "Air Freight", target: "Client Operations", value: 3 }
        ]
    };

    const width = container.clientWidth;
    const height = 500;

    const colors = {
        client: "#2DD4CB",   // Teal
        hub: "#F5A524",      // Amber
        supplier: "#A9B5C6", // Grey
        quality: "#0E3B6B",  // Blue
        logistics: "#4A90E2" // Light Blue
    };

    // Create SVG
    const svg = d3.select("#supply-chain-viz")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; overflow: visible;");

    // Defs for gradients and glow
    const defs = svg.append("defs");
    
    // Glow filter
    const filter = defs.append("filter")
        .attr("id", "glow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");
    
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "5")
        .attr("result", "blur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.radius + 15));

    // Links (lines)
    const link = svg.append("g")
        .attr("stroke", "rgba(255,255,255,0.15)")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value) * 1.5);

    // Nodes (groups)
    const node = svg.append("g")
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .call(drag(simulation));

    // Node circles
    node.append("circle")
        .attr("r", d => d.radius)
        .attr("fill", d => colors[d.group])
        .attr("stroke", "#041224")
        .attr("stroke-width", 3)
        .style("filter", d => d.group === 'hub' ? "url(#glow)" : "none");

    // Hub inner pulse
    node.filter(d => d.group === 'hub')
        .append("circle")
        .attr("r", 20)
        .attr("fill", "white")
        .attr("opacity", 0.8)
        .style("filter", "url(#glow)");

    // Labels
    node.append("text")
        .text(d => d.label)
        .attr("x", 0)
        .attr("y", d => d.radius + 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-family", "Inter, sans-serif")
        .attr("font-size", d => d.group === 'hub' ? "14px" : "12px")
        .attr("font-weight", d => d.group === 'hub' ? "700" : "500")
        .attr("opacity", 0.9);

    // Flowing particles along links to show activity
    const particleInterval = setInterval(() => {
        const linkElem = data.links[Math.floor(Math.random() * data.links.length)];
        if (!linkElem.source.x) return; // not ready yet
        
        svg.append("circle")
            .attr("r", 3)
            .attr("fill", "#2DD4CB")
            .style("filter", "url(#glow)")
            .attr("cx", linkElem.source.x)
            .attr("cy", linkElem.source.y)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("cx", linkElem.target.x)
            .attr("cy", linkElem.target.y)
            .remove();
    }, 200);

    // Simulation tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        svg.attr("width", "100%").attr("viewBox", [0, 0, newWidth, height]);
        simulation.force("center", d3.forceCenter(newWidth / 2, height / 2));
        simulation.alpha(0.3).restart();
    });

    // Drag behavior
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}
